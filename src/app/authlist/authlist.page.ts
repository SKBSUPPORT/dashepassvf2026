import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DataserviceService } from '../dataservice.service';

@Component({
  selector: 'app-authlist',
  templateUrl: './authlist.page.html',
  styleUrls: ['./authlist.page.scss'],
})
export class AuthlistPage implements OnInit {
  autorizados: any[];
  cliente: string;
  clientes: any[];
  clientecarga: any;
  sliceini: number;
  sliceend: number;


  constructor(private data: DataserviceService) { }

  ngOnInit() {

    this.sliceini = 0;
    this.sliceend = 20;
    this.getclientes();
    

  }

  getusers(){
    console.log("acá va función");
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
    this.getautorizados();


  }


  getautorizados() {


    firebase.firestore().collection('autorizados')
      .doc('cliente')
      .collection(this.clientecarga.id)
      .orderBy("NOMBRE", "asc")
      .get()
      .then(docs => {
        docs.forEach(doc => {
          
          this.autorizados.push(doc.data());
        })
      })
      .catch(error => {
        console.log(error);
      })


  }

  //excel
  exportToExcel(event: Event) {

    event.preventDefault();
    this.data.exportToExcel(this.autorizados, 'Autorizados');
  }

}



