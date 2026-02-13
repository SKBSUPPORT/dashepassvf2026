import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutorizadosPage } from './autorizados.page';

const routes: Routes = [
  {
    path: '',
    component: AutorizadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutorizadosPageRoutingModule {}
