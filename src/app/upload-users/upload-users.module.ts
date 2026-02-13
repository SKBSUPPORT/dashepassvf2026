import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadUsersPageRoutingModule } from './upload-users-routing.module';

import { UploadUsersPage } from './upload-users.page';

import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadUsersPageRoutingModule,
    IonicSelectableComponent
  ],
  declarations: [UploadUsersPage]
})
export class UploadUsersPageModule {}
