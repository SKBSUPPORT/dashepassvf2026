import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  cliente: string;
  clients: any[];
  clients2: any[];
  selectedClientForContract: any = null;
  uploadingContract = false;

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getclientes();
  }

  getclientes() {
    firebase.firestore().collection("condominios")
      .orderBy("id", "asc")
      .get()
      .then(async docs => {
        this.clients = [];
        this.clients2 = [];
        docs.forEach(doc => {
          const data = doc.data();
          this.clients.push({
            docId: doc.id,
            id: data.id,
            nombre: data.nombre,
            pais: data.pais,
            email: data.email || data.correo || null,
            status: data.status,
            busqueda: (data.id || '') + (data.nombre || '') + (data.pais || ''),
            contractUrl: data.contractUrl || null,
            contractFileName: data.contractFileName || null
          });
        });
        this.clients2 = this.clients;
      })
      .catch(error => {
        console.log("error obteniendo datos");
      });
  }

  edit(item: any) {
    this.router.navigate(['/editcustomers'], { state: { docId: item.docId } });
  }

  triggerContractInput(item: any) {
    this.selectedClientForContract = item;
    const input = document.getElementById('contract-file-input') as HTMLInputElement;
    if (input) {
      input.value = '';
      input.click();
    }
  }

  async onContractFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file || !this.selectedClientForContract) {
      this.selectedClientForContract = null;
      return;
    }
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowed.includes(ext)) {
      this.showToast('Solo se permiten archivos PDF o Word (.doc, .docx)', 'warning');
      this.selectedClientForContract = null;
      input.value = '';
      return;
    }
    await this.uploadContract(this.selectedClientForContract, file);
    this.selectedClientForContract = null;
    input.value = '';
  }

  async uploadContract(client: any, file: File) {
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo contrato...',
      spinner: 'crescent'
    });
    await loading.present();
    this.uploadingContract = true;
    try {
      const ref = firebase.storage()
        .ref()
        .child(`contracts/${client.docId}/${Date.now()}_${file.name}`);
      await ref.put(file);
      const contractUrl = await ref.getDownloadURL();
      await firebase.firestore().collection('condominios').doc(client.docId).update({
        contractUrl,
        contractFileName: file.name,
        contractUpdatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      client.contractUrl = contractUrl;
      client.contractFileName = file.name;
      await this.showToast('Contrato guardado correctamente', 'success');
    } catch (error: any) {
      console.error(error);
      await this.showToast(error?.message || 'Error al subir el contrato', 'danger');
    } finally {
      this.uploadingContract = false;
      await loading.dismiss();
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color });
    await toast.present();
  }

  async sendContractByEmail(client: any) {
    if (!client?.email?.trim()) {
      this.showToast('Este cliente no tiene correo asociado. Edite el cliente para agregar su email.', 'warning');
      return;
    }
    if (!client?.contractUrl) {
      this.showToast('No hay contrato cargado para este cliente.', 'warning');
      return;
    }
    const loading = await this.loadingCtrl.create({
      message: 'Enviando correo con contrato...',
      spinner: 'crescent'
    });
    await loading.present();
    try {
      const sendEmail = firebase.functions().httpsCallable('sendContractEmail');
      const result = await sendEmail({
        to: client.email.trim(),
        clientName: client.nombre || client.id,
        contractUrl: client.contractUrl,
        contractFileName: client.contractFileName || null
      });
      await loading.dismiss();
      const msg = (result?.data as any)?.message || 'Correo enviado correctamente.';
      await this.showToast(msg, 'success');
    } catch (error: any) {
      await loading.dismiss();
      const msg = error?.message || error?.code || 'Error al enviar el correo.';
      await this.showToast(msg, 'danger');
    }
  }


  getItems(ev: any) {
    // Reset items back to all of the items

    this.initializeItems();


    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.clients2 = this.clients.filter((item) => {
        return (item.busqueda.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }



  initializeItems() {
    console.log("inicio de inicializar");
    this.clients2 = this.clients;
    console.log(this.clients2);
  }

}
