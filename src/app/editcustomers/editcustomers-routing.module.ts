import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditcustomersPage } from './editcustomers.page';

const routes: Routes = [
  {
    path: '',
    component: EditcustomersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditcustomersPageRoutingModule {}
