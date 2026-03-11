import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AlertController, ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  clientes: any[];
  clientecarga: any;
  segment: string;
  clienteselect = true;
  seguridad: boolean;
  reservas: boolean;
  statusqrcontrol: boolean;
  primeravez: string;
  accessgroupev: any;
  accessgrouppe: any;
  arreglo: any[];
  cliente: string;
  nivel1: any[];
  nivel2: any[];
  nivelunoAGEV: any;
  nivelunoAGPE: any;
  statusqrcontrolhik: any;
  primeravezhik: string;
  isEnabledOpenGate: boolean = false;
  initializedOG: boolean = false;


  constructor(private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController) {

    this.segment = "seguridad";
    this.statusqrcontrol = false;
    this.statusqrcontrolhik = false;
    this.primeravez = "X";
    this.primeravezhik = "X";
    this.accessgroupev = "0";
    this.accessgrouppe = "0";

    this.arreglo = [];

    this.arreglo.push({ id: 1 });
    this.arreglo.push({ id: 2 });
    this.arreglo.push({ id: 3 });
    this.arreglo.push({ id: 4 });
    this.arreglo.push({ id: 5 });
    this.arreglo.push({ id: 6 });
    this.arreglo.push({ id: 7 });


  }

  ngAfterViewInit() {
    // Esperamos hasta que la vista esté cargada para habilitar las acciones del toggle
    setTimeout(() => {
      this.initializedOG = true;
    }, 3000); // Ajusta el tiempo según sea necesario
  }

  ngOnInit() {

    this.getclientes();


  }

  getinfo() {
    this.datacliente();
  }

  toggleFunctionalityOG() {
    console.log('Funcionalidad:', this.isEnabledOpenGate ? 'Habilitada' : 'Deshabilitada');
    console.log('Estado inicializado:', this.initializedOG);


    if (this.isEnabledOpenGate == true || this.isEnabledOpenGate == false) {
      this.changeoptionOG(this.isEnabledOpenGate);
    }


  }


  changeoptionOG(valor) {

    if (this.initializedOG == false) {
      this.initializedOG = true;
    }else{
      firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .collection("configuracion")
      .doc("seguridad")
      .update({ opengatebutton: valor })
      .then(doc => {

        console.log("opengatebutton actualizado");
        this.initializedOG = true;

      })
      .catch(error => {
        console.log(error);
      })
    }




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


  clienteChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('cliente:', event.value);

    this.clientecarga = event.value;

    this.primeravez = "X";
    this.initializedOG = false;

    if (this.clientecarga == undefined) {
      this.clienteselect = true;
    } else {
      this.clienteselect = false;
      this.getinfo();
      this.dataseguridad();
    }



  }

  edit(item) {
    console.log("se debe cambiar " + item);

    if (item == 'ev') {



      if (this.accessgroupev.trim() == "") {
        var eventual: any = firebase.firestore.FieldValue.delete();
      } else {
        var eventual: any = this.accessgroupev.trim();
      }



      firebase.firestore().collection("customer")
        .doc(this.clientecarga.id)
        .collection("configuracion")
        .doc("seguridad")
        .update({ SSaccessgroupEV: eventual })
        .then(res => {
          console.log("data actualizada eventual");
          this.userAlert3();
        })
        .catch(error => {
          console.log(error);
          this.userAlert5();
        })

    } else if (item == 'pe') {


      if (this.accessgrouppe.trim() == "") {
        var permanente: any = firebase.firestore.FieldValue.delete();
      } else {
        var permanente: any = this.accessgrouppe.trim();
      }

      firebase.firestore().collection("customer")
        .doc(this.clientecarga.id)
        .collection("configuracion")
        .doc("seguridad")
        .update({ SSaccessgroupPE: permanente })
        .then(res => {
          console.log("data actualizada permanente");
          this.userAlert4();
        })
        .catch(error => {
          console.log(error);
          this.userAlert5();
        })

    }


  }


  cambiosegment() {

    if (this.segment == "seguridad") {
      this.seguridad = true;
      this.reservas = false;

      this.getinfo();

    }

    if (this.segment == "reservas") {
      this.reservas = true;
      this.seguridad = false;
      this.primeravez = "X";
      this.getinfo();

    }



  }

  statuschangehik(ev: any) {

    if (this.primeravezhik != "X") {

      this.statusqrcontrolhik = ev.detail.checked;

      console.log(this.statusqrcontrolhik);

      if (this.statusqrcontrolhik == false) {
        var qrcontrolhik = false;

        //cambiar el smart safe a false
        if (this.statusqrcontrol == false) {
          var qrcontrol = "NO";
        } else if (this.statusqrcontrol == undefined) {
          var qrcontrol = "NO";
        } else {
          var qrcontrol = "SI";
        }

      } else {
        var qrcontrolhik = true;
        var qrcontrol = "NO";


      }

      firebase.firestore().collection("customer")
        .doc(this.clientecarga.id)
        .update({
          qrcontrolhik: qrcontrolhik,
          qrcontrol: qrcontrol
        })
        .then(res => {
          this.datacliente();
          this.updatequeuedqrhik(qrcontrolhik);

        })
        .catch(error => {
          console.log(error);
        })

    } else {
      console.log("la primera vez no debe ejecutar ninguna acción");
      this.primeravezhik = "";
    }




  }

  statuschange(ev: any) {

    if (this.primeravez != "X") {

      this.statusqrcontrol = ev.detail.checked;

      console.log(this.statusqrcontrol);

      if (this.statusqrcontrol == false) {
        var qrcontrol = "NO";

        //cambiar el hik a false
        if (this.statusqrcontrolhik == false) {
          var qrcontrolhik = false;
        } else if (this.statusqrcontrolhik == undefined) {
          var qrcontrolhik = false;
        } else {
          var qrcontrolhik = true;
        }


      } else {
        var qrcontrol = "SI";
        var qrcontrolhik = false;
      }

      firebase.firestore().collection("customer")
        .doc(this.clientecarga.id)
        .update({
          qrcontrol: qrcontrol,
          qrcontrolhik: qrcontrolhik
        })
        .then(res => {
          console.log("qrcontrol actualizado");
          this.datacliente();

          this.updatequeuedqr(qrcontrol);

        })
        .catch(error => {
          console.log(error);
        })

    } else {
      console.log("la primera vez no debe ejecutar ninguna acción");
      this.primeravez = "";
    }




  }

  updatequeuedqrhik(qrcontrolhik) {

    if (qrcontrolhik == true) {

      firebase.firestore().collection("queuehik")
        .doc("cliente")
        .collection(this.clientecarga.id)
        .doc("activado")
        .set({ status: "si" })
        .then(res => {
          this.userAlert1hik();
          this.primeravezhik = "";
        })
        .catch(error => {
          console.log(error);
        })

    } else if (qrcontrolhik == false) {

      firebase.firestore().collection("queuehik")
        .doc("cliente")
        .collection(this.clientecarga.id)
        .doc("activado")
        .delete()
        .then(res => {
          this.userAlert2hik();
          this.primeravezhik = "";
        })
        .catch(error => {
          console.log(error);
        })

    } else {
      console.log("No hay actualización por realizar.");
      this.primeravezhik = "";
    }



  }

  updatequeuedqr(qrcontrol) {

    if (qrcontrol == "SI") {

      firebase.firestore().collection("queuedqr")
        .doc("cliente")
        .collection(this.clientecarga.id)
        .doc("activado")
        .set({ status: "si" })
        .then(res => {
          this.userAlert1();
          this.primeravez = "";
        })
        .catch(error => {
          console.log(error);
        })

    } else if (qrcontrol == "NO") {

      firebase.firestore().collection("queuedqr")
        .doc("cliente")
        .collection(this.clientecarga.id)
        .doc("activado")
        .delete()
        .then(res => {
          this.userAlert2();
          this.primeravez = "";
        })
        .catch(error => {
          console.log(error);
        })

    } else {
      console.log("No hay actualización por realizar.");
      this.primeravez = "";
    }



  }

  datacliente() {

    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .get()
      .then(doc => {

        if (doc.data().qrcontrol == undefined) {
          this.statusqrcontrol = false;
        } else if (doc.data().qrcontrol == "NO") {
          this.statusqrcontrol = false;
        } else if (doc.data().qrcontrol == "SI") {
          this.statusqrcontrol = true;
        } else {
          this.statusqrcontrol = false;
        }

        if (doc.data().qrcontrolhik == undefined) {
          this.statusqrcontrolhik = false;
        } else if (doc.data().qrcontrolhik == false) {
          this.statusqrcontrolhik = false;
        } else if (doc.data().qrcontrolhik == true) {
          this.statusqrcontrolhik = true;
        } else {
          this.statusqrcontrolhik = false;
        }

        this.obtainaccessgroup();


      })
      .catch(error => {
        console.log(error);
        this.statusqrcontrol = false;
      })


  }
  obtainaccessgroup() {

    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .collection("configuracion")
      .doc("seguridad")
      .get()
      .then(doc => {

        if (doc.exists == true) {

          if (doc.data().SSaccessgroupEV == undefined) {
            this.accessgroupev = "0";
          } else {
            this.accessgroupev = doc.data().SSaccessgroupEV;
          }

          if (doc.data().SSaccessgroupPE == undefined) {
            this.accessgrouppe = "0";
          } else {
            this.accessgrouppe = doc.data().SSaccessgroupPE;
          }

        } else {

          this.accessgroupev = "0";
          this.accessgrouppe = "0";

        }



      })
      .catch(error => {
        console.log(error);
        this.accessgroupev = "0";
        this.accessgrouppe = "0";
      })

    this.obtenernivel1();


  }

  async userAlert1() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Dato actualizado en la colección queuedqr",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert1hik() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Dato actualizado en la colección queuehik",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert2() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Dato eliminado en la colección queuedqr",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert2hik() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Dato eliminado en la colección queuehik",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert3() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Access group eventual actualizado",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert4() {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "Access group permanente actualizado",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert5() {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: "Hubo un error en la actualización del access group.",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert6(nivel1) {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "El access group de " + nivel1 + " fue actualizado",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }

  async userAlert7(nivel1, nivel2) {
    const alert = await this.alertCtrl.create({
      header: 'Exitoso',
      subHeader: "El access group de " + nivel1 + " - " + " fue actualizado",
      cssClass: 'secondary',
      buttons: ['OK']
    });
    alert.present();
  }


  async obtenernivel1() {

    this.nivel1 = [];

    firebase.firestore().collection('customer')
      .doc(this.clientecarga.id)
      .collection('distribucion')
      .orderBy("name", "asc")
      .get()
      .then(docs => {

        this.nivel1 = [];

        docs.forEach(doc => {

          // if(doc.data().SSaccessgroupPE == undefined || doc.data().SSaccessgroupPE == ""){
          //   var permanente = "No activo";
          // }else{
          //   permanente = doc.data().SSaccessgroupPE;
          // }

          // if(doc.data().SSaccessgroupPE == undefined || doc.data().SSaccessgroupPE == ""){
          //   var permanente = "No activo";
          // }else{
          //   permanente = doc.data().SSaccessgroupPE;
          // }

          console.log(doc.data());

          this.nivel1.push({
            nivel1: doc.data().name,
            doc: doc.id,
            SSaccessgroupPE: doc.data().SSaccessgroupPE,
            SSaccessgroupEV: doc.data().SSaccessgroupEV
          });

        })

        this.obtenernivel2();

      })
      .catch(error => {
        console.log(error);
      })

  }

  obtenernivel2() {

    this.nivel2 = [];

    for (let i = 0; i < this.nivel1.length; i++) {
      const niveluno = this.nivel1[i];



      firebase.firestore().collection('customer')
        .doc(this.clientecarga.id)
        .collection('distribucion')
        .doc(niveluno.nivel1)
        .collection("nivel2")
        .orderBy("name", "asc")
        .get()
        .then(docs => {


          docs.forEach(doc => {



            this.nivel2.push({
              nivel1: doc.data().nivel1,
              SSaccessgroupEV: doc.data().SSaccessgroupEV,
              SSaccessgroupPE: doc.data().SSaccessgroupPE,
              nivel2: doc.data().name,
              doc: doc.id
            });



          })

          console.log(this.nivel2);

        })
        .catch(error => {
          console.log(error);
        })

    };



  }




  async showmenu2(detalle) {

    console.log(detalle);


    let radio_options = [];

    radio_options.push({
      name: 'accessgroupev',
      label: "Access group Eventual",
      type: 'string',
      value: detalle.SSaccessgroupEV,
      placeholder: 'Digite access group eventual'
    });

    radio_options.push({

      name: 'accessgrouppe',
      label: "Access group Permanente",
      type: 'string',
      value: detalle.SSaccessgroupPE,
      placeholder: 'Digite access group permanente'
    });


    const alert = await this.alertCtrl.create({
      header: detalle.nivel1 + " - " + detalle.nivel2,
      inputs: radio_options,

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
        ,
        {
          text: 'Actualizar',
          handler: data => {

            console.log(data);

            this.updateagnivel2(detalle.nivel1.trim(), detalle.nivel2.trim(), data);


          }
        }
      ]

    });
    alert.present();





  }



  async showmenu(detalle) {


    let radio_options = [];

    radio_options.push({
      name: 'accessgroupev',
      label: "Access group Eventual",
      type: 'string',
      value: detalle.SSaccessgroupEV,
      placeholder: 'Digite access group eventual'
    });

    radio_options.push({

      name: 'accessgrouppe',
      label: "Access group Permanente",
      type: 'string',
      value: detalle.SSaccessgroupPE,
      placeholder: 'Digite access group permanente'
    });


    const alert = await this.alertCtrl.create({
      header: detalle.nivel1,
      inputs: radio_options,

      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }
        ,
        {
          text: 'Actualizar',
          handler: data => {

            console.log(data);

            this.updateagnivel1(detalle.nivel1, data);


          }
        }
      ]

    });
    alert.present();





  }
  updateagnivel1(nivel1, data) {

    if (data.accessgrouppe.trim() == "") {
      var permanente: any = firebase.firestore.FieldValue.delete();
    } else {
      var permanente: any = data.accessgrouppe.trim();
    }

    if (data.accessgroupev.trim() == "") {
      var eventual: any = firebase.firestore.FieldValue.delete();
    } else {
      var eventual: any = data.accessgroupev.trim();
    }




    firebase.firestore().collection('customer')
      .doc(this.clientecarga.id)
      .collection('distribucion')
      .doc(nivel1)
      .update({
        SSaccessgroupPE: permanente,
        SSaccessgroupEV: eventual
      })
      .then(doc => {

        console.log("nivel1 actualizado");
        this.userAlert6(nivel1);

        this.primeravez = "X";
        this.getinfo();

      })
      .catch(error => {
        console.log(error);
      })



  }

  updateagnivel2(nivel1, nivel2, data) {

    if (data.accessgrouppe.trim() == "") {
      var permanente: any = firebase.firestore.FieldValue.delete();
    } else {
      var permanente: any = data.accessgrouppe.trim();
    }

    if (data.accessgroupev.trim() == "") {
      var eventual: any = firebase.firestore.FieldValue.delete();
    } else {
      var eventual: any = data.accessgroupev.trim();
    }

    firebase.firestore().collection('customer')
      .doc(this.clientecarga.id)
      .collection('distribucion')
      .doc(nivel1)
      .collection("nivel2")
      .doc(nivel2)
      .update({
        SSaccessgroupPE: permanente,
        SSaccessgroupEV: eventual
      })
      .then(doc => {

        console.log("nivel1 actualizado");
        this.userAlert7(nivel1, nivel2);

        this.primeravez = "X";
        this.getinfo();

      })
      .catch(error => {
        console.log(error);
      })






  }


  dataseguridad() {



    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .collection("configuracion")
      .doc("seguridad")
      .get()
      .then(doc => {

        if (doc.exists == false) {
          console.log("No existe el documento de seguridad");
          this.isEnabledOpenGate = false;
          return;
        }

        console.log(doc.data());

        //habilitar boton opengate
        if (doc.data().opengatebutton == undefined || doc.data().opengatebutton == null) {
          this.isEnabledOpenGate = false;
        } else {
          this.isEnabledOpenGate = doc.data().opengatebutton;
        }

      })
      .catch(error => {
        console.log(error);
      })
  }

}
