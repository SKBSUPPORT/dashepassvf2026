import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },

  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },

    {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'upload-users',
    loadChildren: () => import('./upload-users/upload-users.module').then(m => m.UploadUsersPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'editcustomers',
    loadChildren: () => import('./editcustomers/editcustomers.module').then(m => m.EditcustomersPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'horarios',
    loadChildren: () => import('./horarios/horarios.module').then(m => m.HorariosPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'autorizados',
    loadChildren: () => import('./autorizados/autorizados.module').then(m => m.AutorizadosPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'medidores',
    loadChildren: () => import('./medidores/medidores.module').then(m => m.MedidoresPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'config',
    loadChildren: () => import('./config/config.module').then(m => m.ConfigPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'authlist',
    loadChildren: () => import('./authlist/authlist.module').then(m => m.AuthlistPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'sync',
    loadChildren: () => import('./sync/sync.module').then(m => m.SyncPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'modulos',
    loadChildren: () => import('./modulos/modulos.module').then(m => m.ModulosPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'generate-units',
    loadChildren: () => import('./generate-units/generate-units.module').then(m => m.GenerateUnitsPageModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'control-servicio',
    loadChildren: () => import('./control-servicio/control-servicio.module').then( m => m.ControlServicioPageModule),
    canActivate: [AuthGuard]
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
