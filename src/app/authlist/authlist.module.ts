import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthlistPageRoutingModule } from './authlist-routing.module';

import { AuthlistPage } from './authlist.page';

import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableComponent,
    AuthlistPageRoutingModule
  ],
  declarations: [AuthlistPage]
})
export class AuthlistPageModule {}
