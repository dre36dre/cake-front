import { Routes } from '@angular/router';
import { ProdutoList } from './pages/produtos/produto-list/produto-list';
import { ProdutoForm } from './pages/produtos/produto-form/produto-form';
import { ProdutoDetail } from './pages/produtos/produto-detail/produto-detail';
import { Login } from './auth/login/login';
import { AdminPage } from './pages/admin/admin';
import { ClientePage } from './pages/cliente/cliente';
import { Catalogo } from './pages/catalogo/catalogo';
import { Carrinho } from './pages/carrinho/carrinho';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'produtos', component: Catalogo },
  { path: 'carrinho', component: Carrinho },
  { path: 'admin', component: AdminPage },
  { path: 'admin/produtos', component: ProdutoList },
  { path: 'admin/produtos/novo', component: ProdutoForm },
  { path: 'admin/produtos/:id', component: ProdutoDetail },
  { path: 'login', component: Login },
  { path: 'cliente', component: ClientePage },
  { path: 'produtos/novo', redirectTo: 'admin/produtos/novo', pathMatch: 'full' },
  { path: 'produtos/:id', redirectTo: 'admin/produtos/:id', pathMatch: 'full' }
];