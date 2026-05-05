import { Routes } from '@angular/router';
import { PedidosComponent } from './admin/pedidos/pedidos.component';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { AuthGuard } from './admin/auth-guard';

export const routes: Routes = [
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'admin/login' }
];
