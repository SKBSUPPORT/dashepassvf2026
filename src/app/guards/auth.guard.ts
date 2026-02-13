import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): Promise<boolean> {

    return new Promise(resolve => {

      firebase.auth().onAuthStateChanged(user => {

        if (user) {

          resolve(true);

        } else {

          this.router.navigate(['/login']);
          resolve(false);

        }

      });

    });

  }

}
