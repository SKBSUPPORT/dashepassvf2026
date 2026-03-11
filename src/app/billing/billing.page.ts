import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';


type RootStatus = 'ACTIVE' | 'SUSPENDED';
type RootReason = 'CONTRACT_BREACH' | 'NON_PAYMENT' | 'MANUAL' | string | null;

interface BillingInfo {
  enabled?: boolean;
  currency?: 'CRC' | 'USD';
  monthlyFee?: number;

  activeInvoiceId?: string | null;
  periodKey?: string | null;

  issueDate?: firebase.firestore.Timestamp | null;
  dueDate?: firebase.firestore.Timestamp | null;
  graceUntil?: firebase.firestore.Timestamp | null;

  lastPaidAt?: firebase.firestore.Timestamp | null;
}

interface CustomerStatusDoc {
  id: string; // customerId
  adminEmail?: string;

  status?: RootStatus;
  reason?: RootReason;
  message?: string | null;
  graceUntil?: firebase.firestore.Timestamp | null; // (root) NO lo usamos para billing

  billing?: BillingInfo;

  updatedAt?: firebase.firestore.Timestamp | null;
  updatedBy?: string | null;
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.page.html',
  styleUrls: ['./billing.page.scss'],
})
export class BillingPage implements OnInit {

  segment: 'ALL' | 'ACTIVE' | 'SUSPENDED' = 'ALL';

  all: CustomerStatusDoc[] = [];
  view: CustomerStatusDoc[] = [];

  // reglas tuyas
  readonly billingDay = 5;
  readonly termsDays = 30;
  readonly graceDays = 3;

  adminId = localStorage.getItem('userepass') || 'admin';
  private db = firebase.firestore();

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.load();
  }

  async ionViewWillEnter() {
    await this.load();
  }

  async load() {
    try {
      const snap = await this.db.collection('customerStatus').get();
      const rows: CustomerStatusDoc[] = [];
      snap.forEach(doc => rows.push({ id: doc.id, ...(doc.data() as any) }));
      rows.sort((a, b) => (a.id).localeCompare(b.id));
      this.all = rows;
      this.applyFilter();
    } catch (e) {
      console.error(e);
      await this.toast('Error cargando customerStatus');
    }
  }

  applyFilter() {
    if (this.segment === 'ALL') this.view = [...this.all];
    else this.view = this.all.filter(x => (x.status || 'ACTIVE') === this.segment);
  }

  onSegmentChange(ev: any) {
    this.segment = ev?.detail?.value || 'ALL';
    this.applyFilter();
  }

  // --------------------------
  // Helpers
  // --------------------------
  hasBillingConfigured(c: CustomerStatusDoc) {
    const b = c.billing;
    return !!(b?.enabled && (b.monthlyFee || 0) > 0 && !!b.currency);
  }

  money(c: CustomerStatusDoc) {
    const b = c.billing || {};
    const cur = b.currency || 'CRC';
    const amt = typeof b.monthlyFee === 'number' ? b.monthlyFee : 0;
    return `${cur} ${amt.toLocaleString()}`;
  }

  fmt(ts?: firebase.firestore.Timestamp | null) {
    if (!ts) return '-';
    const d = ts.toDate();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  nowPeriodKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  issueDateFor(periodKey: string) {
    const [y, m] = periodKey.split('-').map(n => parseInt(n, 10));
    return new Date(y, m - 1, this.billingDay, 12, 0, 0);
  }

  addDays(base: Date, days: number) {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }

  // --------------------------
  // 1) Configurar billing (crear billing.* en customerStatus)
  // --------------------------
  async configureBilling(c: any) {
    const alert = await this.alertCtrl.create({
      header: `Billing (${c.id})`,
      message: 'Configura moneda y monto mensual',
      inputs: [
        {
          name: 'currency',
          type: 'text',
          placeholder: 'USD o CRC',
          value: (c.billing?.currency || 'USD'),
        },
        {
          name: 'monthlyFee',
          type: 'number',
          placeholder: 'Monto mensual',
          value: String(c.billing?.monthlyFee ?? 0),
        },
        {
          name: 'enabled',
          type: 'text',
          placeholder: 'true / false',
          value: String(c.billing?.enabled ?? true),
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data: any) => {
            const currency = (data.currency || 'USD').toUpperCase().trim();
            const monthlyFee = Number(data.monthlyFee || 0);
            const enabled = String(data.enabled).toLowerCase().trim() === 'true';
  
            if (!['USD', 'CRC'].includes(currency)) {
              this.toast('Moneda inválida. Usa USD o CRC.');
              return false; // no cierra el alert
            }
            if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
              this.toast('El monto mensual debe ser mayor a 0.');
              return false;
            }
  
            await firebase.firestore()
              .collection('customerStatus')
              .doc(c.id)
              .set({
                billing: {
                  ...(c.billing || {}),
                  currency,
                  monthlyFee,
                  enabled,
                },
                updatedAt: new Date(),
                updatedBy: localStorage.getItem('userepass') || 'admin',
              }, { merge: true });
  
            this.toast('Billing actualizado');
            this.load(); // refresca lista
            return true;
          }
        }
      ]
    });
  
    await alert.present();
  }

  // --------------------------
  // 2) Generar facturas del mes (invoices + customerStatus.billing.*)
  // --------------------------
  async generateMonthInvoices() {
    const periodKey = this.nowPeriodKey();

    const alert = await this.alertCtrl.create({
      header: 'Generar facturas',
      message: `Creará facturas ${periodKey} para clientes con billing configurado.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Generar',
          handler: async () => this.generateInvoices(periodKey)
        }
      ]
    });
    await alert.present();
  }

  async generateInvoices(periodKey: string) {
    const loading = await this.loadingCtrl.create({ message: 'Generando...' });
    await loading.present();

    try {
      const issue = this.issueDateFor(periodKey);
      const due = this.addDays(issue, this.termsDays);
      const grace = this.addDays(due, this.graceDays);

      let created = 0, existed = 0, skipped = 0;

      for (const c of this.all) {
        if (!this.hasBillingConfigured(c)) { skipped++; continue; }

        const invoiceId = `${c.id}_${periodKey}`;
        const invRef = this.db.collection('invoices').doc(invoiceId);
        const invSnap = await invRef.get();

        if (invSnap.exists) {
          existed++;
        } else {
          created++;
          const b = c.billing!;
          await invRef.set({
            invoiceId,
            customerId: c.id,
            periodKey,
            status: 'OPEN',
            currency: b.currency,
            amount: b.monthlyFee,

            issueDate: firebase.firestore.Timestamp.fromDate(issue),
            dueDate: firebase.firestore.Timestamp.fromDate(due),
            graceUntil: firebase.firestore.Timestamp.fromDate(grace),

            paidAt: null,
            paidBy: null,
            paymentRef: null,

            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        }

        // Actualiza SOLO billing.*, no toques status root aquí
        await this.db.collection('customerStatus').doc(c.id).set({
          billing: {
            activeInvoiceId: invoiceId,
            periodKey,
            issueDate: firebase.firestore.Timestamp.fromDate(issue),
            dueDate: firebase.firestore.Timestamp.fromDate(due),
            graceUntil: firebase.firestore.Timestamp.fromDate(grace),
          },
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: this.adminId,
        }, { merge: true });
      }

      await this.toast(`Listo. Creadas:${created} Existían:${existed} Omitidas:${skipped}`);
      await this.load();
    } catch (e) {
      console.error(e);
      await this.toast('Error generando facturas');
    } finally {
      await loading.dismiss();
    }
  }

  // --------------------------
  // 3) Marcar pagado (invoice PAID + customerStatus.billing.lastPaidAt + reactivar si NON_PAYMENT)
  // --------------------------
  async markPaid(c: CustomerStatusDoc) {
    const invoiceId = c.billing?.activeInvoiceId;
    if (!invoiceId) return this.toast('No hay activeInvoiceId');

    const alert = await this.alertCtrl.create({
      header: 'Marcar pagada',
      message: `Factura: <b>${invoiceId}</b><br>Cliente: <b>${c.id}</b>`,
      inputs: [
        { name: 'paymentRef', type: 'text', placeholder: 'Referencia (opcional)' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async (data) => {
            await this.doMarkPaid(c.id, invoiceId, data?.paymentRef || null);
          }
        }
      ]
    });
    await alert.present();
  }

  async doMarkPaid(customerId: string, invoiceId: string, paymentRef: string | null) {
    const loading = await this.loadingCtrl.create({ message: 'Actualizando...' });
    await loading.present();

    const invRef = this.db.collection('invoices').doc(invoiceId);
    const csRef = this.db.collection('customerStatus').doc(customerId);

    try {
      await this.db.runTransaction(async (tx) => {
        const invSnap = await tx.get(invRef);
        if (!invSnap.exists) throw new Error('Invoice no existe');

        const csSnap = await tx.get(csRef);
        const cs = csSnap.exists ? (csSnap.data() as any) : {};

        const inv = invSnap.data() as any;
        if (inv.status === 'PAID') return;

        tx.update(invRef, {
          status: 'PAID',
          paidAt: firebase.firestore.FieldValue.serverTimestamp(),
          paidBy: this.adminId,
          paymentRef,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        tx.set(csRef, {
          billing: {
            lastPaidAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedBy: this.adminId,
        }, { merge: true });

        // Reactivar SOLO si estaba suspendido por NON_PAYMENT
        if (cs?.status === 'SUSPENDED' && cs?.reason === 'NON_PAYMENT') {
          tx.set(csRef, {
            status: 'ACTIVE',
            reason: null,
            message: null,
            graceUntil: null,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: this.adminId,
          }, { merge: true });
        }
      });

      await this.toast('Pago registrado');
      await this.load();
    } catch (e) {
      console.error(e);
      await this.toast('Error marcando pagada');
    } finally {
      await loading.dismiss();
    }
  }

  // --------------------------
  // 4) Control manual customerStatus (bloqueo)
  // --------------------------
  async editRootStatus(c: CustomerStatusDoc) {
    const alert = await this.alertCtrl.create({
      header: 'Estado de servicio (bloqueo)',
      message: `Cliente: ${c.id}`,
      inputs: [
        { type: 'radio', name: 'st', label: 'ACTIVE', value: 'ACTIVE', checked: (c.status || 'ACTIVE') === 'ACTIVE' },
        { type: 'radio', name: 'st', label: 'SUSPENDED', value: 'SUSPENDED', checked: c.status === 'SUSPENDED' },
        { name: 'message', type: 'text', placeholder: 'Mensaje (opcional)', value: c.message || '' },
        { name: 'reason', type: 'text', placeholder: 'Reason (ej: CONTRACT_BREACH / MANUAL / NON_PAYMENT)', value: (c.reason || '') as any },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            const newStatus = (typeof data === 'string' ? data : data?.st) as RootStatus;
            const message = (typeof data === 'string' ? '' : (data?.message || '')).trim() || null;
            const reason = (typeof data === 'string' ? null : ((data?.reason || '') as any)) || null;

            await this.db.collection('customerStatus').doc(c.id).set({
              status: newStatus,
              reason,
              message,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              updatedBy: this.adminId,
            }, { merge: true });

            await this.toast('Estado actualizado');
            await this.load();
          }
        }
      ]
    });
    await alert.present();
  }

  async toast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 1700, position: 'bottom' });
    await t.present();
  }


  async editarBilling(cliente: any) {
    const alert = await this.alertCtrl.create({
      header: 'Configurar facturación',
      inputs: [
        {
          name: 'monthlyFee',
          type: 'number',
          placeholder: 'Monto mensual',
          value: cliente.billing?.monthlyFee || 0
        },
        {
          name: 'currency',
          type: 'text',
          placeholder: 'Moneda (USD o CRC)',
          value: cliente.billing?.currency || 'USD'
        },
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Habilitar facturación',
          checked: cliente.billing?.enabled ?? true
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
  
            const billing = {
              enabled: data.enabled?.length > 0, // checkbox devuelve array
              currency: data.currency,
              monthlyFee: Number(data.monthlyFee)
            };
  
            await firebase.firestore()
            .collection('customerStatus')
              .doc(cliente.id)
              .update({
                billing: billing,
                updatedAt: new Date(),
                updatedBy: 'admin'
              });
  
            console.log('Billing actualizado');
          }
        }
      ]
    });
  
    await alert.present();
  }

  async loadInvoicesForClient(clienteId: string) {
    const snap = await firebase.firestore()
      .collection('invoices')
      .where('customerId', '==', clienteId)
      .orderBy('issueDate', 'desc')
      .get();
  
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }


}