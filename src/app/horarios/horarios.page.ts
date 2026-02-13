import { Component, OnInit } from '@angular/core';
import * as papa from 'papaparse';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.page.html',
  styleUrls: ['./horarios.page.scss'],
})
export class HorariosPage implements OnInit {

  csv: any[];
  carga: any[];
  selectedFile: File;
  cliente: string;
  boton1: boolean;
  boton2: boolean;
  boton3: boolean;
  contador: number;
  planstatus: number;
  check: string;
  clientes: any[];
  clientecarga: any;

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {

    this.boton1 = true;
    this.boton2 = false;
    this.boton3 = false;
    this.check = "";
    this.planstatus = 0;

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

          console.log(dato1);

          if (dato1[0] != undefined) {
            // console.log(dato1[0]);

            // var newarr = dato1[0].split(";", 2);
            // console.log(newarr);

            if (dato1[0] == '') {

            } else {
              this.carga.push({
                START: dato1[0],
                END: dato1[1], 
                STATUS: 'Pendiente'
              });
            }


          }




        };

        console.log(this.carga);

      })

    })

    this.boton1 = false;
    this.boton2 = true;
    this.boton3 = false;

  }



  async validardata() {




    this.contador = 0;


    this.carga.forEach((carga, index) => {

      console.log(index);



      firebase.firestore().collection('horarios')
        .doc(this.clientecarga.id)
        .collection('horarios')
        .where("START", '==', carga.START)
        .where("END", '==', carga.END)
        .limit(1)
        .get()
        .then(consultas => {
          consultas.forEach(consulta => {

            this.carga[index].STATUS = 'Ya existe';

            return this.funtion1();

          })

        })

        .catch(error => {
          console.log("error en busqueda");
        })


    })

    console.log(this.contador);

    console.log("sigue thischeck >>>" + this.check);

    if (this.check != "") {
      this.boton2 = false;
      this.boton1 = true;
      this.boton3 = false;
    } else {
      this.boton2 = false;
      this.boton1 = false;
      this.boton3 = true;
    }

  }

  funtion1() {

    console.log("paso por function1");

    this.check = "Ya existen datos cargados, proceda a revisar la plantilla y elimine los datos ya existentes ";
    this.contador = this.contador + 1.
    this.boton2 = false;
    this.boton1 = true;
    this.boton3 = false;

  }

  salvardata() {


    this.carga.forEach((carga, index) => {

      console.log(carga);

      if (carga.STATUS == "Pendiente") {
        firebase.firestore().collection('horarios')
          .doc(this.clientecarga.id)
          .collection('horarios')
          .add({
            START: carga.START,
            END: carga.END,
          })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);

            this.carga[index].STATUS = "Completado";


          })
          .catch((error) => {
            console.error("Error adding document: ", error);

          });
      }
    })

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
