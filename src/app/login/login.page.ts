import { Component } from '@angular/core';
import * as firebase from 'firebase';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email:string="";
  password:string="";
  showPassword = false;
  isLoading = false;
  submitted = false;

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  async login() {

    if (this.isLoading) {
      return;
    }

    this.submitted = true;

    if (!this.email || !this.password || !this.isEmailValid(this.email)) {
      return;
    }

    this.isLoading = true;

    try {
      await firebase.auth().signInWithEmailAndPassword(this.email, this.password);
      console.log('LOGIN OK');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      console.error(error);

      let message = 'Ocurrió un error al iniciar sesión. Intente de nuevo.';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Email o contraseña incorrectos.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Demasiados intentos fallidos. Intente más tarde.';
      }

      this.presentAlert(message);
    } finally {
      this.isLoading = false;
    }

  }

 

togglePassword() {
  this.showPassword = !this.showPassword;
}

  private async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Inicio de sesión',
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  get emailError(): string | null {
    if (!this.submitted) {
      return null;
    }

    if (!this.email) {
      return 'El correo es obligatorio.';
    }

    if (!this.isEmailValid(this.email)) {
      return 'Ingrese un correo válido.';
    }

    return null;
  }

  get passwordError(): string | null {
    if (!this.submitted) {
      return null;
    }

    if (!this.password) {
      return 'La contraseña es obligatoria.';
    }

    return null;
  }

  private isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}
