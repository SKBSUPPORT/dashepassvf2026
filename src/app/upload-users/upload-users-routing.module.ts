import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadUsersPage } from './upload-users.page';

const routes: Routes = [
  {
    path: '',
    component: UploadUsersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadUsersPageRoutingModule {}
