import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { LoginAdminComponent } from './admin/login/login-admin.component';
import { PedidosComponent } from './admin/pedidos/pedidos.component';
import { ProdutosAdminComponent } from './admin/produtos/produtos-admin.component';
import { AlterarSenhaComponent } from './admin/alterar-senha/alterar-senha.component';
import { AuthGuard } from './core/guards/auth-guard';
import { ImagensHomeAdminComponent } from './admin/imagens-home/imagens-home-admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'carrinho', component: CarrinhoComponent },
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/pedidos', component: PedidosComponent, canActivate: [AuthGuard] },
  { path: 'admin/produtos', component: ProdutosAdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/alterar-senha', component: AlterarSenhaComponent, canActivate: [AuthGuard] },
  { path: 'admin/imagens-home', component: ImagensHomeAdminComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
