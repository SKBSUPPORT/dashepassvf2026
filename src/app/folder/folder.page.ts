import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { NavController, LoadingController, NavParams, AlertController, Platform, ToastController, ActionSheetController, BooleanValueAccessor } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  cliente: number;
  nombre: string;
  pais: string;
  status: string;

  constructor(private activatedRoute: ActivatedRoute,
    private alertCtrl: AlertController,
  ) {

    //VARIABLES POR DEFAULT
    this.status = "activo";
    this.pais = 'CR';
    this.nombre = "";

  }

  ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
  }


  async postConfirm() {
    console.log("ingresó a postconfirm")
    let alert = await this.alertCtrl.create({
      header: 'Guardar cliente',
      message: '¿Está seguro de Crear el cliente?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: () => {
            console.log('Guardar confirmado');
            this.insert_firebase();

          }
        }
      ]
    });
    await alert.present();
  }

  async paisChanged(ev: any) {

    this.pais = ev.detail.value;
    console.log(this.pais);

  }

  async statusChanged(ev: any) {

    this.status = ev.detail.value;
    console.log(this.status);

  }

  insert_firebase() {

    this.nombre = this.nombre.trim();

    if (this.nombre == "") {

      this.userAlert3();

    } else {

      if (this.cliente > 1) {

        var cliente = this.pais + this.cliente;


        firebase.firestore().collection('customer')
          .doc(cliente)
          .get()
          .then(doc => {

            if (doc.exists == true) {
              this.userAlert1(cliente);
            } else {

              this.addcliente(cliente, this.nombre, this.status, this.pais);

            }
          })
          .catch(error => {
            console.log("ocurrio un error");
          })


      } else {

        this.userAlert4();



      }



    }



  }

  register(evento) {
    console.log("regsiter");
  }

  addcliente(cliente, nombre, status, pais) {

    firebase.firestore().collection('customer')
      .doc(cliente)
      .set({ nombre: nombre, status: status, COUNTRY: pais, tipoestado: 'manual', qrcontrol: "NO" })
      .then(doc => {
        console.log(doc);

        firebase.firestore().collection('condominios')
          .doc()
          .set({ nombre: nombre, status: status, pais: pais, id: cliente, qrcontrol: "NO", qrcontrolhik: false })
          .then(doc => {

            firebase.firestore().collection('consecutivos')
              .doc('cliente')
              .collection(cliente)
              .doc('amenidades')
              .set({ id: 1 })
              .then(doc => {

                firebase.firestore().collection('consecutivos')
                  .doc('cliente')
                  .collection(cliente)
                  .doc('autorizados')
                  .set({ id: 1 })
                  .then(doc => {

                    firebase.firestore().collection('consecutivos')
                      .doc('cliente')
                      .collection(cliente)
                      .doc('rondas')
                      .set({ id: 1 })
                      .then(doc => {

                        firebase.firestore().collection('consecutivos')
                          .doc('cliente')
                          .collection(cliente)
                          .doc('usersqr')
                          .set({ id: 1 })
                          .then(doc => {

                            this.userAlert2(cliente);

                          })
                          .catch(error => {
                            console.log(error);
                          })

                      })
                      .catch(error => {
                        console.log(error);
                      })

                  })
                  .catch(error => {
                    console.log(error);
                  })

              })
              .catch(error => {
                console.log(error);
              })



          })
          .catch(error => {

          })






      })
      .catch(error => {
        console.log("ocurrio un error");
      })

  }


  async userAlert1(cliente) {
    const alert = await this.alertCtrl.create({
      header: 'Cliente ya existente',
      subHeader: "El cliente " + cliente + ", ya existe",
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert2(cliente) {
    const alert = await this.alertCtrl.create({
      header: 'Cliente creado',
      subHeader: "El cliente " + cliente + ", fue creado éxitosamente",
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert3() {
    const alert = await this.alertCtrl.create({
      header: 'Cliente sin nombre',
      subHeader: "El campo nombre de cliente está vácio.",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }


  async userAlert4() {
    const alert = await this.alertCtrl.create({
      header: '# de cliente',
      subHeader: "El # de cliente no ha sido seleccionado",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }


}
