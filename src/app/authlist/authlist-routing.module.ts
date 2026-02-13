import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthlistPage } from './authlist.page';

const routes: Routes = [
  {
    path: '',
    component: AuthlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthlistPageRoutingModule {}
