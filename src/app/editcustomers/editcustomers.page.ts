import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController, Platform, ToastController,ActionSheetController } from '@ionic/angular';



@Component({
  selector: 'app-editcustomers',
  templateUrl: './editcustomers.page.html',
  styleUrls: ['./editcustomers.page.scss'],
})
export class EditcustomersPage implements OnInit {

  newcode: string;
  newname: string;
  newpais: string;
  newemail: string;
  latitud: string;
  longitud: string;
  status:string;

  constructor(private alertCtrl: AlertController,) { }

  ngOnInit() {
  }


  async postConfirm(){


    console.log("ingresó a postConfirm")
    let alert = await this.alertCtrl.create({
    header: 'Confirmar cambios',
    message: '¿Está seguro de cambiar el cliente?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Confirmar',
        handler: () => {
          console.log('Cambios realizados');
         
       /*    this.postChange(); */
         
    
        }
      }
    ]
    });
    await alert.present();
    }

}
