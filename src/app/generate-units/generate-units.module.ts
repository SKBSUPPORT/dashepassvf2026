import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateUnitsPageRoutingModule } from './generate-units-routing.module';

import { GenerateUnitsPage } from './generate-units.page';
import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableComponent,
    GenerateUnitsPageRoutingModule
  ],
  declarations: [GenerateUnitsPage]
})
export class GenerateUnitsPageModule {}
