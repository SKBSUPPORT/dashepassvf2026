import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-control-servicio',
  templateUrl: './control-servicio.page.html',
  styleUrls: ['./control-servicio.page.scss'],
})
export class ControlServicioPage implements OnInit {

  config: any = {};
  clientes: any[];
  cliente: any = null;


  constructor() { }

  ngOnInit() {
    this.getclientes();
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


  DEFAULT_CONFIG = {

    // tabs
    tabfiliales: true,
    tabgestiones: true,
    tabseguridad: true,

    // autorizados
    addev: true,
    addpe: true,
    addre: true,

    // funciones
    digitalkeyusr: true,
    digitalkeyaut: true,

    opengatebutton: true,
    opengateqrbutton: true,

    scanface: true,
    scanhistory: true,

    statusAirbnb: true,

    // estado del cliente (MUY IMPORTANTE)
    enabled: true

  };

  clienteChange(event: any) {

    const clienteId = event.value.id;

    console.log("Cliente seleccionado:", clienteId);

    firebase.firestore()
      .doc(`customer/${clienteId}/configuracion/seguridad`)
      .get()
      .then(doc => {

        if (doc.exists) {

          this.config = doc.data();

          console.log("Configuración cargada:", this.config);

        } else {

          console.log("No existe configuración, creando default");

          this.config = {
            tabfiliales: false,
            tabgestiones: false,
            tabseguridad: false,
            addev: false,
            addpe: false,
            addre: false,
            digitalkeyusr: false,
            opengatebutton: false,
            opengateqrbutton: false,
            scanface: false,
            scanhistory: false,
            statusAirbnb: false
          };

        }

      });

  }

  toggle(key: string) {

    if (!this.cliente?.id) return;

    console.log("Guardando:", key, this.config[key]);

    firebase.firestore()
      .doc(`customer/${this.cliente.id}/configuracion/seguridad`)
      .set({
        [key]: this.config[key]
      }, { merge: true });

  }



}
