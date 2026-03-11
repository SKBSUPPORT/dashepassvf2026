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
  pageTitle = 'Dashboard';

  private titleMap: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/folder': 'Crear cliente',
    '/customers': 'Clientes',
    '/users': 'Usuarios',
    '/upload-users': 'Cargar usuarios',
    '/generate-units': 'Crear usuarios',
    '/horarios': 'Horarios',
    '/autorizados': 'Crear Autorizados',
    '/authlist': 'Autorizados',
    '/sync': 'Sincronización',
    '/modulos': 'Módulos',
    '/medidores': 'Medidores',
    '/config': 'Configuración',
    '/control-servicio': 'Control de servicio',
    '/billing': 'Facturación',
    '/editcustomers': 'Editar cliente'
  };

  public appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'grid-outline', group: 'Principal' },
    { title: 'Módulos', url: '/modulos', icon: 'grid', group: 'Principal' },
    { title: 'Crear cliente', url: '/folder', icon: 'cube', group: 'Clientes' },
    { title: 'Clientes', url: '/customers', icon: 'business-outline', group: 'Clientes' },
    { title: 'Control de servicio', url: '/control-servicio', icon: 'shield-checkmark-outline', group: 'Clientes' },
    { title: 'Facturación', url: '/billing', icon: 'card-outline', group: 'Facturación' },
    { title: 'Crear usuarios', url: '/generate-units', icon: 'person-add-outline', group: 'Usuarios' },
    { title: 'Cargar usuarios', url: '/upload-users', icon: 'cloud-upload-outline', group: 'Usuarios' },
    { title: 'Usuarios', url: '/users', icon: 'people-outline', group: 'Usuarios' },
    { title: 'Crear Horarios', url: '/horarios', icon: 'calendar-outline', group: 'Horarios' },
    { title: 'Crear Autorizados', url: '/autorizados', icon: 'list-outline', group: 'Horarios' },
    { title: 'Autorizados', url: '/authlist', icon: 'checkmark-done-outline', group: 'Horarios' },
    { title: 'Sincronización', url: '/sync', icon: 'sync-outline', group: 'Sistema' },
    { title: 'Medidores', url: '/medidores', icon: 'water-outline', group: 'Sistema' },
    { title: 'Configuración', url: '/config', icon: 'settings-outline', group: 'Sistema' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  nameusers: any[];

  constructor(private router: Router) {
    firebase.initializeApp(firebaseConfig);

    const url = this.router.url.split('?')[0];
    if (url && url !== '/login') {
      this.pageTitle = this.titleMap[url] || 'Epass Admin';
    }

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        if (event.url === '/login') {
          this.showMenu = false;
        } else {
          this.showMenu = true;
          const baseUrl = event.url.split('?')[0];
          this.pageTitle = this.titleMap[baseUrl] || 'Epass Admin';
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


