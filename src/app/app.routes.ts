import { Routes } from '@angular/router';
import { ProdutoList } from './pages/produtos/produto-list/produto-list';
import { ProdutoForm } from './pages/produtos/produto-form/produto-form';
import { Login } from './auth/login/login';
import { AdminPage } from './pages/admin/admin';
import { ClientePage } from './pages/cliente/cliente';
import { Catalogo } from './pages/catalogo/catalogo';
import { Carrinho } from './pages/carrinho/carrinho';
import { HomePage } from './pages/home/home';
import { HomeImagesAdmin } from './pages/admin/home-images/home-images';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'produtos', component: Catalogo },
  { path: 'carrinho', component: Carrinho },
  { path: 'admin', component: AdminPage, canActivate: [authGuard] },
  { path: 'admin/produtos', component: ProdutoList, canActivate: [authGuard] },
  { path: 'admin/produtos/novo', component: ProdutoForm, canActivate: [authGuard] },
  { path: 'admin/produtos/:id', component: ProdutoForm, canActivate: [authGuard] },
  { path: 'admin/imagens-home', component: HomeImagesAdmin, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'cliente', component: ClientePage },
  { path: 'produtos/novo', redirectTo: 'admin/produtos/novo', pathMatch: 'full' },
  { path: 'produtos/:id', redirectTo: 'admin/produtos/:id', pathMatch: 'full' }
];