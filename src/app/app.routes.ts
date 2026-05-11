import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProdutosComponent } from './components/produtos/produtos.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';

import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { PedidosComponent } from './admin/pedidos/pedidos.component';
import { ProdutosAdminComponent } from './admin/produtos/produtos-admin.component';
import { AuthGuard } from './admin/auth-guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'carrinho', component: CarrinhoComponent },

  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'admin/produtos', component: ProdutosAdminComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];
