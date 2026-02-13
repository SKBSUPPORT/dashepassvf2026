import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SyncPageRoutingModule } from './sync-routing.module';
import { SyncPage } from './sync.page';
import { IonicSelectableComponent } from 'ionic-selectable'; // Import the component

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicSelectableComponent,
    IonicModule,
    SyncPageRoutingModule
  ],
  declarations: [SyncPage]
})
export class SyncPageModule {}
