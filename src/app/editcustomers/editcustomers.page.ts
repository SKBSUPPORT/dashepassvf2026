import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-editcustomers',
  templateUrl: './editcustomers.page.html',
  styleUrls: ['./editcustomers.page.scss'],
})
export class EditcustomersPage implements OnInit {

  docId: string = null;
  newcode: string = '';
  newname: string = '';
  newpais: string = '';
  newemail: string = '';
  latitud: string = '';
  longitud: string = '';
  status: string = '';

  constructor(
    private alertCtrl: AlertController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    const state = this.router.getCurrentNavigation()?.extras?.state || history.state;
    this.docId = state?.docId || null;
    if (!this.docId) {
      this.showToast('No se especificó el cliente a editar.', 'warning');
      this.router.navigate(['/customers']);
      return;
    }
    this.loadClient();
  }

  async loadClient() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando cliente...',
      spinner: 'crescent'
    });
    await loading.present();
    try {
      const doc = await firebase.firestore().collection('condominios').doc(this.docId).get();
      if (!doc.exists) {
        await this.showToast('Cliente no encontrado.', 'warning');
        this.router.navigate(['/customers']);
        return;
      }
      const d = doc.data();
      this.newcode = d?.id ?? '';
      this.newname = d?.nombre ?? '';
      this.newpais = d?.pais ?? '';
      this.newemail = d?.email ?? d?.correo ?? '';
      this.latitud = d?.latitud ?? '';
      this.longitud = d?.longitud ?? '';
      this.status = d?.status ?? 'Activo';
    } catch (e) {
      console.error(e);
      await this.showToast('Error al cargar el cliente.', 'danger');
      this.router.navigate(['/customers']);
    } finally {
      await loading.dismiss();
    }
  }

  async postConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar cambios',
      message: '¿Está seguro de cambiar el cliente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => this.postChange()
        }
      ]
    });
    await alert.present();
  }

  async postChange() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    await loading.present();
    try {
      await firebase.firestore().collection('condominios').doc(this.docId).update({
        id: this.newcode?.trim() || '',
        nombre: this.newname?.trim() || '',
        pais: this.newpais?.trim() || '',
        email: this.newemail?.trim() || '',
        latitud: this.latitud?.trim() || '',
        longitud: this.longitud?.trim() || '',
        status: this.status || 'Activo'
      });
      await this.showToast('Cliente actualizado correctamente.', 'success');
      this.router.navigate(['/customers']);
    } catch (e: any) {
      console.error(e);
      await this.showToast(e?.message || 'Error al guardar.', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({ message, duration: 3000, color });
    await toast.present();
  }
}
