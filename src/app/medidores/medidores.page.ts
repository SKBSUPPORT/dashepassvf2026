import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as moment from 'moment';
import * as papa from 'papaparse';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.page.html',
  styleUrls: ['./medidores.page.scss'],
})
export class MedidoresPage implements OnInit {

  boton1: boolean;
  boton2: boolean;
  boton3: boolean;
  selectedFile: any;
  csv: any[];
  carga: any[];
  clientes: any[];
  clientecarga: any;
  check: string;
  users: any[];

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {

    this.boton1 = true;
    this.boton2 = false;
    this.boton3 = false;
    this.getclientes();

  }

  getclientes() {

    firebase.firestore().collection("condominios")
      .orderBy("id", "asc")
      .get()
      .then(async docs => {

        this.clientes = [];
        docs.forEach(doc => {
          console.log(doc.data());
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
    console.log('cliente:', event.value);
    this.clientecarga = event.value;

    this.getusers();

  }

  onFileChanged(event) {
    this.selectedFile = event.target.files[0];

    console.log(this.selectedFile);
    console.log(this.selectedFile.name);

    this.csv = [];

    this.carga = [];

    papa.parse(event.target.files[0], {
      encoding: 'utf-8',
      complete: (async results => {


        i = 0;

        for (var i = 0; i < results.data.length; i++) {
          console.log(results.data[i]);

          var dato1 = results.data[i];

          if (dato1[0] == "") {

          } else {

            this.carga.push({
              FILIAL: dato1[0],
              NIVEL1: dato1[1],
              NIVEL2: dato1[2],
              PERIODO: dato1[3],
              METROS2: Number(dato1[4]),
              ANTERIOR: Number(dato1[5]),
              ACTUAL: Number(dato1[6]),
              DIFERENCIA: Number(dato1[7]),
            });
          }

        };

        console.log(this.carga);

      })

    })

    this.boton1 = false;
    this.boton2 = true;
    this.boton3 = false;

  }

  validardata() {

    this.check = "";

    i = 0;

    for (var i = 0; i < this.carga.length; i++) {


      const result = this.users.find(({ user }) => user === this.carga[i].FILIAL);



      if (result == undefined) {
        this.carga[i].status = "Filial no existe";
        /* this.check = "X"; */
      } else {

        if (this.carga[i].ANTERIOR >= 0) {
          this.carga[i].status = "Listo para cargar";
        } else {
          this.carga[i].status = "Monto no es un número";
          this.check = "X";
        }

      }

    }

    if (this.check == "X") {
      this.boton2 = false;
      this.boton1 = true;
      this.boton3 = false;
    } else {
      this.boton2 = false;
      this.boton1 = false;
      this.boton3 = true;
    }




  }


  getusers() {

    this.users = [];

    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .collection("users")
      .get()
      .then(docs => {
        docs.forEach(doc => {
          this.users.push({ user: doc.id });
        })
      })
      .catch(error => {
        console.log(error);
      })


  }

  async salvardata() {

    i = 0;

    for (var i = 0; i < this.carga.length; i++) {

      setTimeout(() => {
        console.log('next');
      }, 1000);

      console.log(this.carga[i]);

      var datosacargar = this.carga[i];
      console.log(this.clientecarga.id);

      firebase.firestore().collection('customer')
        .doc(this.clientecarga.id)
        .collection("mediciones")
        .doc("agua")
        .collection("filiales")
        .doc(this.carga[i].FILIAL)
        .update({
          estatus: "Completado",//ok
          metros2: this.carga[i].METROS2, //ok
          nivel1: this.carga[i].NIVEL1, //ok
          nivel2: this.carga[i].NIVEL2, //ok
          periodo: this.carga[i].PERIODO, //ok
          diferencia: this.carga[i].DIFERENCIA,//ok
          log:"2025-10-16 14:56:15",
          foto:1,//ok
          saldoactual: this.carga[i].ACTUAL, //ok
          saldoanterior: this.carga[i].ANTERIOR, //ok
        })
        .then(doc => {
          console.log("exitoso");
          console.log(datosacargar);
          console.log(doc);

        })
        .catch(error => {
          console.log(error);

        })



    }

    this.userAlert1();




  }

  async userAlert1() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Proceso finalizado éxitosamente",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }


}
