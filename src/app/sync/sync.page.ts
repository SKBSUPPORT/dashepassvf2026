import { Component, OnInit } from '@angular/core';
import { DataserviceService } from '../dataservice.service';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertController } from '@ionic/angular';

import * as moment from 'moment';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.page.html',
  styleUrls: ['./sync.page.scss'],
})
export class SyncPage implements OnInit {
  sliceini: number;
  sliceend: number;
  clientes: any[];
  clientecarga: any;
  autorizados: any[];
  inicio: number = 1;
  cliente: string;
  fin: number = 10;

  constructor(private data: DataserviceService,
    private alertCtrl: AlertController,) { }

  ngOnInit() {

    this.sliceini = 0;
    this.sliceend = 20;
    this.getclientes();

  }

  getclientes() {

    firebase.firestore().collection("condominios")
      .orderBy("nombre", "asc")
      .get()
      .then(async docs => {

        this.clientes = [];
        docs.forEach(doc => {

          this.clientes.push({ id: doc.data().id, name: doc.data().nombre });
        })
      })
      .catch(error => {
        console.log("error obteniendo datos");
      })


  }

  clienteChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {

    this.clientecarga = event.value;
    this.autorizados = [];



  }


  getautorizados() {

    this.autorizados = [];

    if (this.inicio == undefined) {
      console.log("no hay id inicial digitado");
    } else {

      if (this.fin == undefined) {
        console.log("no hay id final digitado");
      } else {

        console.log("entro a buscar get autorizados");
        console.log(this.clientecarga.id);

        firebase.firestore().collection('autorizados')
          .doc('cliente')
          .collection(this.clientecarga.id)
          .where("STATUS", "==", "SI")
          .where("ID", ">=", this.inicio)
          .where("ID", "<=", this.fin)
          .orderBy("ID", "asc")
          // .limit(1000)
          .get()
          .then(docs => {

            console.log(docs.size);


            docs.forEach(doc => {

              // if (doc.data().SYNC != 1) {
                console.log("sincronizando");
                console.log(doc.data());

                var numero = doc.data().ID.toString();

                if (doc.data().CATEGORY != "RE") {


                  if (doc.data().CATEGORY == "EV") {

                    if (doc.data().DATE_IN == "" || doc.data().DATE_IN == undefined) {
                      console.log("no se procesa por no tener fechas completas");
                    } else if (doc.data().DATE_OUT == "" || doc.data().DATE_OUT == undefined) {
                      console.log("no se procesa por no tener fechas completas");
                    }else{
                      this.autorizados.push({
                        ID: numero,
                        NOMBRE: doc.data().NOMBRE,
                        CATEGORY: doc.data().CATEGORY,
                        DATE_IN: doc.data().DATE_IN,
                        DATE_OUT: doc.data().DATE_OUT,
                        DOC: doc.id,
                      });
                    }

                  } else {

                    this.autorizados.push({
                      ID: numero,
                      NOMBRE: doc.data().NOMBRE,
                      CATEGORY: doc.data().CATEGORY,
                      DATE_IN: doc.data().DATE_IN,
                      DATE_OUT: doc.data().DATE_OUT,
                      DOC: doc.id,
                    });

                  }

                } else {
                  console.log("no procede por ser recurrente");
                }

              // } else {
              //   console.log("ya sincronizado");
              // }


            })
          })
          .catch(error => {
            console.log(error);
          })
      }
    }



  }

  async sincronizar() {


    let alert = await this.alertCtrl.create({
      header: 'Sincronizar',
      message: '¿Está seguro de sincronizar estos autorizados?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: async () => {


            this.autorizados.forEach(element => {

              console.log(element);

              if (element.CATEGORY == "PE") {

                var time = "NO";
                var startvalidate = "";
                var endvalidate = "";

              } else if (element.CATEGORY == "EV") {

                var time = "SI";
                var startvalidate = moment(element.DATE_IN).format('YYYY-MM-DD HH');
                var endvalidate = moment(element.DATE_OUT).format('YYYY-MM-DD HH');

              } else {

                var time = "NO";
                var startvalidate = "";
                var endvalidate = "";

              }


              firebase.firestore().collection('queuedqr')
                .doc('cliente')
                .collection(this.clientecarga.id)
                .doc()
                .set({
                  id: element.ID,
                  name: element.NOMBRE,
                  time: time,
                  customer: this.clientecarga.id,
                  accessgroup: "1",
                  startvalidate: startvalidate,
                  endvalidate: endvalidate,
                  datecreation: moment().format('YYYY-MM-DD HH:mm:ss'),
                  type: "I"
                })
                .then(async res => {

                  console.log("registro procesado con exito");
                  console.log(element.ID);




                  firebase.firestore().collection('autorizados')
                    .doc('cliente')
                    .collection(this.clientecarga.id)
                    .doc(element.DOC)
                    .update({ SYNC: 1 })
                    .then(res => {
                      console.log("autorizado actualizado en forma exitosa")
                    })

                    .catch(error => {
                      console.log(error);
                    })



                })
                .catch(async error => {

                  console.log("error al crear firebase >>> " + error)
                });



            });

            // this.router.navigate(['/readqrron']);

          }
        }
      ]
    });
    alert.present();

  }

  loadData(event) {
    setTimeout(() => {

      event.target.complete();

      this.sliceend = this.sliceend + 20;

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.autorizados.length === 1000) {
        event.target.disabled = true;
      }
    }, 1000);
  }

}
