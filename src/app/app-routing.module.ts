import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },

      // USER
      {
        path: 'user',
        canActivate: [() => RoleGuard(['USER', 'ADMIN'])],
        loadChildren: () =>
          import('./features/user/user.module')
            .then(m => m.UserModule)
      },

      // ADMIN
      {
        path: 'admin',
        canActivate: [() => RoleGuard(['ADMIN'])],
        loadChildren: () =>
          import('./features/admin/admin.module')
            .then(m => m.AdminModule)
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}