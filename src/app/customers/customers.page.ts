import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
})
export class CustomersPage implements OnInit {
  cliente: string;
  clients: any[];
  clients2: any[];

  constructor(private router: Router,) {

  }

  ngOnInit() {
    this.getclientes();

  }



  getclientes() {

    firebase.firestore().collection("condominios")
      .orderBy("id", "asc")
      .get()
      .then(async docs => {

        this.clients = [];
        this.clients2 = [];
        docs.forEach(doc => {
          console.log(doc.data());
          

          this.clients.push({
            id: doc.data().id,
            nombre: doc.data().nombre,
            pais: doc.data().pais,
            status: doc.data().status,
            busqueda: doc.data().id + doc.data().nombre + doc.data().id + doc.data().pais
          })

        })

        this.clients2 = this.clients;
      })
      .catch(error => {
        console.log("error obteniendo datos");
      })


  }

  edit() {

    this.router.navigate(['/editcustomers', {
      /*                        param1: this.readuserService.nombre,
                                param2: this.readuserService.telefono,
                                param3: this.readuserService.ubicacion,
                                param4: this.readuserService.email,
                                param5: this.readuserService.ident,
                                param6: this.readuserService.vehiculo */
    }]);

  }


  getItems(ev: any) {
    // Reset items back to all of the items

    this.initializeItems();


    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.clients2 = this.clients.filter((item) => {
        return (item.busqueda.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }



  initializeItems() {
    console.log("inicio de inicializar");
    this.clients2 = this.clients;
    console.log(this.clients2);
  }

}
