import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditcustomersPageRoutingModule } from './editcustomers-routing.module';

import { EditcustomersPage } from './editcustomers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditcustomersPageRoutingModule
  ],
  declarations: [EditcustomersPage]
})
export class EditcustomersPageModule {}
