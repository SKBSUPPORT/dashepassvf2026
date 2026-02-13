import { Component, OnInit } from '@angular/core';
import * as papa from 'papaparse';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-autorizados',
  templateUrl: './autorizados.page.html',
  styleUrls: ['./autorizados.page.scss'],
})
export class AutorizadosPage implements OnInit {
  clientes: any[];
  clientecarga: any;
  boton1: boolean;
  boton2: boolean;
  boton3: boolean;
  selectedFile: any;
  csv: any[];
  carga: any[];
  sliceini: number;
  sliceend: number;

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {

    this.sliceini = 0;
    this.sliceend = 20;
    this.boton1 = true;
    this.boton2 = false;
    this.boton3 = false;
    this.getclientes();
  }

  loadData(event) {
    setTimeout(() => {

      event.target.complete();

      this.sliceend = this.sliceend + 20;

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.carga.length === 1000) {
        event.target.disabled = true;
      }
    }, 1000);
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
              ID: Number(dato1[0]),
              FILIAL: dato1[1],
              CATEGORY: dato1[2],
              NOMBRE: dato1[3],
              IDENT: dato1[4],
              OBSER: dato1[5],
              PLACA: dato1[6],
              DAYS: dato1[7],
              TELEF: dato1[8],
              FECHA: moment().format('YYYY-MM-DD HH:mm:ss'),
              DATE_IN: dato1[9],
              DATE_OUT: dato1[10],
              LOG: firebase.firestore.FieldValue.arrayUnion("Creada el " + moment().format("YYYY-MM-DD HH:mm:ss") + " por Soporte EPASS"),
              LOCAL: 'X',
              STATUS: "SI",
              PHOTO: "https://firebasestorage.googleapis.com/v0/b/epassdev-ae8ff.appspot.com/o/imageauto%2FIDdefault.png?alt=media&token=2c6d0b03-07a4-4436-bcf9-87617738f7f7"
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


    i = 0;

    for (var i = 0; i < this.carga.length; i++) {

      /*       console.log(this.carga[i].usuario);
      
            const result = this.users.find(({ user }) => user === this.carga[i].usuario);
      
            console.log(result);
      
            if (result != undefined) {
              this.carga[i].status = "Ya existe";
      
              this.check = "Ya existen datos cargados, proceda a revisar la plantilla y elimine los datos ya existentes ";
      
      
            } */



    }

    /*     if (this.check != "") {
          this.boton2 = false;
          this.boton1 = true;
          this.boton3 = false;
        } else {
          this.boton2 = false;
          this.boton1 = false;
          this.boton3 = true;
        } */

    this.boton2 = false;
    this.boton1 = false;
    this.boton3 = true;

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

      firebase.firestore().collection('autorizados')
        .doc('cliente')
        .collection(this.clientecarga.id)
        .doc()
        .set({
          ID: this.carga[i].ID,
          FILIAL: this.carga[i].FILIAL,
          CATEGORY: this.carga[i].CATEGORY,
          NOMBRE: this.carga[i].NOMBRE,
          IDENT: this.carga[i].IDENT,
          OBSER: this.carga[i].OBSER,
          PLACA: this.carga[i].PLACA,
          DAYS: this.carga[i].DAYS,
          TELEF: this.carga[i].TELEF,
          FECHA: this.carga[i].FECHA,
          DATE_IN: this.carga[i].DATE_IN,
          DATE_OUT: this.carga[i].DATE_OUT,
          LOG: this.carga[i].LOG,
          LOCAL: this.carga[i].LOCAL,
          STATUS: this.carga[i].STATUS,
          PHOTO: this.carga[i].PHOTO
        })
        .then(doc => {
          console.log("exitoso");
          console.log(datosacargar);
          console.log(doc);

        })
        .catch(error => {
          console.log("error");

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
