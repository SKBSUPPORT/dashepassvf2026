import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
})
export class LoginPage {

  email:string="";
  password:string="";
  showPassword = false;

  constructor(private router:Router){}

  login(){

    firebase.auth()
    .signInWithEmailAndPassword(this.email, this.password)
    .then(user=>{

      console.log("LOGIN OK");

      this.router.navigate(['/dashboard']);

    })
    .catch(error=>{

      alert("Email o contraseña incorrectos");

    });

  }

 

togglePassword() {
  this.showPassword = !this.showPassword;
}

}
