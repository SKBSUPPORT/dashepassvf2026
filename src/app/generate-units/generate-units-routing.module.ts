import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateUnitsPage } from './generate-units.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateUnitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateUnitsPageRoutingModule {}
