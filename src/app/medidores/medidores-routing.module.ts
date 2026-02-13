import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MedidoresPage } from './medidores.page';

const routes: Routes = [
  {
    path: '',
    component: MedidoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedidoresPageRoutingModule {}
