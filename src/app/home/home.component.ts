import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from '../components/produtos/produtos.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProdutosComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  imagensHome = [
    { arquivo: 'home.JPG', titulo: 'Confeitaria da Dona' },
    { arquivo: 'bolo.JPG', titulo: 'Bolos' },
    { arquivo: 'brigadeiro-home.JPG', titulo: 'Brigadeiros' },
    { arquivo: 'brigadeiro-home-2.JPG', titulo: 'Brigadeiros especiais' },
    { arquivo: 'beijinho.JPG', titulo: 'Beijinhos' },
    { arquivo: 'pudim.JPG', titulo: 'Pudins' },
    { arquivo: 'pudim-2.JPG', titulo: 'Pudins especiais' },
    { arquivo: 'trufas.JPG', titulo: 'Trufas' },
    { arquivo: 'copo-surpresa.JPG', titulo: 'Copo surpresa' },
    { arquivo: 'cardapio-doces.JPG', titulo: 'Doces' },
    { arquivo: 'cardapio-festa.JPG', titulo: 'Festa' },
    { arquivo: 'cardapio-pudim.JPG', titulo: 'Cardapio pudim' }
  ];
}
