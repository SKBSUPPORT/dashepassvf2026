import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HorariosPageRoutingModule } from './horarios-routing.module';

import { HorariosPage } from './horarios.page';

import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableComponent,
    HorariosPageRoutingModule
  ],
  declarations: [HorariosPage]
})
export class HorariosPageModule {}
