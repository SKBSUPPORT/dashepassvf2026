import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';


@Component({
  selector: 'app-generate-units',
  templateUrl: './generate-units.page.html',
  styleUrls: ['./generate-units.page.scss'],
})
export class GenerateUnitsPage implements OnInit {

  cliente:any;
  clientes:any[] = [];

  prefijo:string = "";
  cantidad:number = 50;

  ngOnInit() {

    this.loadClientes();

  }

  loadClientes(){

    firebase.firestore()
    .collection("customer") // asegúrate que esta es la colección correcta
    .orderBy("nombre", "asc")
    .get()
    .then(snapshot => {

      this.clientes = snapshot.docs.map(doc => ({
        id: doc.id, // IMPORTANTE
        name: doc.data().nombre
      }));

      console.log("CLIENTES CARGADOS:", this.clientes);

    })
    .catch(error=>{
      console.error(error);
    });

  }

  clienteChange(event:any){

    console.log("Cliente seleccionado:", this.cliente);

  }


get prefijoUpper(){
  return this.prefijo?.toUpperCase() || '';
}

generar(){

  if(!this.cliente){
    alert("Seleccione cliente");
    return;
  }

  if(!this.prefijo || !this.cantidad){
    alert("Complete todos los campos");
    return;
  }

  const batch = firebase.firestore().batch();

  const padding = String(this.cantidad).length; 

  // ejemplo: 50 → padding 2
  // ejemplo: 500 → padding 3

 // 🔥 1. CREAR ADMIN (solo una vez)

    const ref = firebase.firestore()
      .collection("customer")
      .doc(this.cliente.id)
      .collection("users")
      .doc("ADMIN");

    batch.set(ref,{
      userId: "ADMIN",
      nombre: "Administrador",
      category: "ADM",
      customer: this.cliente.id,
      status: "activo",
      password: "adm123",
      createdAt: Date.now(),
      
    });



  // 🔥 2. CREAR UNIDADES

  for(let i = 1; i <= this.cantidad; i++){

    const numero = String(i).padStart(padding, '0');

    const userId = `${this.prefijo.trim().toUpperCase()}${numero}`;

    const ref = firebase.firestore()
      .collection("customer")
      .doc(this.cliente.id)
      .collection("users")
      .doc(userId);

    batch.set(ref,{
      userId,
      nombre: `${this.prefijo} ${numero}`,
      category: "PRO",
      customer: this.cliente.id,
      status: "activo",
      password: "1234",
      createdAt: Date.now(),
      numero: i // opcional (MUY recomendado)
    });

  }

  batch.commit().then(()=>{
    alert("Unidades generadas correctamente");
  });

}

}
