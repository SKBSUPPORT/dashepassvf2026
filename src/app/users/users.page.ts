import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';
import { DataserviceService } from '../dataservice.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  nameusers: any[];
  cliente: string;
  clientes: any[];
  clientecarga: any;


  constructor(private data: DataserviceService,) {

   }

  ngOnInit() {

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


getusers() {

    firebase.firestore().collection("customer")
    .doc(this.clientecarga.id)
    .collection("users")
/*     .where("status", "==", "activo") */
    .orderBy("userId", "asc")
    .onSnapshot(async docs => {
      this.nameusers = [];
      docs.forEach(doc => {
        console.log(doc.data());
        this.nameusers.push(doc.data());
      })
    })


}

    //excel
    exportToExcel(event: Event) {

      event.preventDefault();
    this.data.exportToExcel(this.nameusers, 'Usuarios');
    }

}
