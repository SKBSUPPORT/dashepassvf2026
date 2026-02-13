import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AutorizadosPageRoutingModule } from './autorizados-routing.module';

import { AutorizadosPage } from './autorizados.page';

import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableComponent,
    AutorizadosPageRoutingModule
  ],
  declarations: [AutorizadosPage]
})
export class AutorizadosPageModule {}
