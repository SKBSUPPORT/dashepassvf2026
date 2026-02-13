import { Component, OnInit } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import * as firebase from 'firebase';
import * as papa from 'papaparse';
import { AlertController } from '@ionic/angular';

class Cliente {
  public id: number;
  public name: string;
}

@Component({
  selector: 'app-upload-users',
  templateUrl: './upload-users.page.html',
  styleUrls: ['./upload-users.page.scss'],
})
export class UploadUsersPage implements OnInit {

  csv: any[];
  carga: any[];
  selectedFile: File;
  boton1: boolean;
  boton2: boolean;
  boton3: boolean;

  clientes: Cliente[];
  cliente: Cliente;
  pais: any;
  users: any[];
  clientecarga: any;
  check: string;
  carga2: any[];

  constructor(private alertCtrl: AlertController) {

    /*    this.pais = "CR"; */

  }

  ngOnInit() {
    this.getclientes();

    this.boton1 = true;
    this.boton2 = false;
    this.boton3 = false;
    this.check = "";

  }

  clienteChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('cliente:', event.value);
    this.clientecarga = event.value;

    this.getusers();


  }

  getclientes() {

    firebase.firestore().collection("condominios")
      .orderBy("nombre", "asc")
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

            var usuariocarga = dato1[0].trim();
            usuariocarga = usuariocarga.toUpperCase();

            this.carga.push({
              userId: usuariocarga, 
              nombre: dato1[1],
              category: dato1[2],
              email: dato1[3],
              telefono: dato1[4],
              ident: dato1[5],
              vehiculo: dato1[6], 
              nivel1: dato1[7],
              nivel2: dato1[8],
              metros2: Number(dato1[9]),
              password: dato1[10],
              status: "Pendiente"
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


  getusers() {

    console.log("sigue id cliente");
    console.log(this.clientecarga);

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

    console.log(this.users);

  }

  validardata() {


    i = 0;

    for (var i = 0; i < this.carga.length; i++) {



      const result = this.users.find(({ user }) => user === this.carga[i].userId);

      console.log(result);

      if (result != undefined) {
        this.carga[i].status = "Ya existe";

        this.check = "Ya existen datos cargados, proceda a revisar la plantilla y elimine los datos ya existentes ";


      }



    }

        if (this.check != "") {
          this.boton2 = false;
          this.boton1 = true;
          this.boton3 = false;
        } else {
          this.boton2 = false;
          this.boton1 = false;
          this.boton3 = true;
        } 


    this.boton2 = false;
    this.boton1 = false;
    this.boton3 = true;




  }


  salvardata() {

    this.carga2 = [];

    i = 0;

    for (var i = 0; i < this.carga.length; i++) {

      if (this.carga[i].status == "Ya existe") {

        firebase.firestore().collection("customer")
          .doc(this.clientecarga.id)
          .collection("users")
          .doc(this.carga[i].userId)
          .update({
            userId: this.carga[i].userId,
            nombre: this.carga[i].nombre,
            category: this.carga[i].category,
            email: this.carga[i].email,
            telefono: this.carga[i].telefono,
            ident: this.carga[i].ident,
            vehiculo: this.carga[i].vehiculo, 
            nivel1: this.carga[i].nivel1,
            nivel2: this.carga[i].nivel2,
            metros2: this.carga[i].metros2,
            password: this.carga[i].password,
            customer: this.clientecarga.id,
            status: 'activo'  
          })
          .then(doc => {
            console.log("exitoso");

            this.carga[i].status = "Exitoso";

          })
          .catch(error => {
            console.log("error");

          })

      } else {

         firebase.firestore().collection("customer")
          .doc(this.clientecarga.id)
          .collection("users")
          .doc(this.carga[i].userId)
          .set({
            userId: this.carga[i].userId,
            nombre: this.carga[i].nombre,
            category: this.carga[i].category, 
            email: this.carga[i].email,
            telefono: this.carga[i].telefono,
            ident: this.carga[i].ident,
            vehiculo: this.carga[i].vehiculo,
            nivel1: this.carga[i].nivel1,
            nivel2: this.carga[i].nivel2,
            metros2: this.carga[i].metros2,
            password: this.carga[i].password,
            customer: this.clientecarga.id,
            status: 'activo'
          })
          .then(doc => {
            console.log("exitoso");

            this.carga[i].status = "Exitoso";

          })
          .catch(error => {
            console.log("error");

          }) 

      }







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
