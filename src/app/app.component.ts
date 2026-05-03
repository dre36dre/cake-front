import { Component } from '@angular/core';
import { MenuComponent } from './components/menu/menu.component';
import { CarrinhoComponent } from './components/carrinho/carrinho.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MenuComponent, CarrinhoComponent],
  template: `
    <app-menu></app-menu>
    <app-carrinho></app-carrinho>
  `
})
export class AppComponent {}