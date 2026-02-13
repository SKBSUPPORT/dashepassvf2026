import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MedidoresPageRoutingModule } from './medidores-routing.module';

import { MedidoresPage } from './medidores.page';
import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    IonicSelectableComponent,
    FormsModule,
    IonicModule,
    MedidoresPageRoutingModule
  ],
  declarations: [MedidoresPage]
})
export class MedidoresPageModule {}
