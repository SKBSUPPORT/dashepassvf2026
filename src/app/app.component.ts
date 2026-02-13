import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const firebaseConfig = {
  apiKey: "AIzaSyAesQWhqh5L5JWXmrYDf4uolr7WM-8vNxo",
  authDomain: "epassdev-ae8ff.firebaseapp.com",
  databaseURL: "https://epassdev-ae8ff.firebaseio.com",
  projectId: "epassdev-ae8ff",
  storageBucket: "epassdev-ae8ff.appspot.com",
  messagingSenderId: "443160947519",
  appId: "1:443160947519:web:67ba4c23a9ebf0cd69c18a",
  measurementId: "G-YVNTNYSB8T"
};



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

 showMenu = true;

  public appPages = [
  
  
    { title: 'Dashboard', url: '/dashboard', icon: 'grid-outline' },
    { title: 'Módulos', url: '/modulos', icon: 'grid' },
    { title: 'Crear cliente', url: '/folder', icon: 'cube' },
    { title: 'Clientes', url: '/customers', icon: 'settings' },
    { title: 'Control de servicio', url: '/control-servicio', icon: 'shield-checkmark-outline' },
    { title: 'Crear usuarios', url: '/generate-units', icon: 'person' },
    { title: 'Cargar usuarios', url: '/upload-users', icon: 'person' },
    { title: 'Usuarios', url: '/users', icon: 'people' },
    { title: 'Crear Horarios', url: '/horarios', icon: 'calendar' },
    { title: 'Crear Autorizados', url: '/autorizados', icon: 'list' },
    { title: 'Autorizados', url: '/authlist', icon: 'checkmark' },    
    { title: 'Sincronización', url: '/sync', icon: 'sync-circle' }, 
    { title: 'Medidores', url: '/medidores', icon: 'water' },
    { title: 'Configuración', url: '/config', icon: 'options' },
    
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  nameusers: any[];

  constructor(private router:Router) {  
    
    firebase.initializeApp(firebaseConfig);

    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: any) => {

      if (event.url === '/login') {
        this.showMenu = false;
      } else {
        this.showMenu = true;
      }

    });


  }

  logout(){

  firebase.auth().signOut()

  .then(() => {

    this.router.navigate(['/login']);

  });



} 

}


