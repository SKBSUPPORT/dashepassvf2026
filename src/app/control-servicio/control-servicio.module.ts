import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ControlServicioPageRoutingModule } from './control-servicio-routing.module';

import { ControlServicioPage } from './control-servicio.page';
import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableComponent,
    ControlServicioPageRoutingModule
  ],
  declarations: [ControlServicioPage]
})
export class ControlServicioPageModule {}
