import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from '../components/produtos/produtos.component';

interface ImagemHome {
  arquivo: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProdutosComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  imagensHome: ImagemHome[] = [
    { arquivo: 'beijinho.JPG' },
    { arquivo: 'bolo.JPG' },
    { arquivo: 'brigadeiro-home.JPG' },
    { arquivo: 'brigadeiro-home-2.JPG' },
    { arquivo: 'cardapio-doces.JPG' },
    { arquivo: 'cardapio-festa.JPG' },
    { arquivo: 'cardapio-pudim.JPG' },
    { arquivo: 'cardapio-pudim-editada.JPG' },
    { arquivo: 'copo-surpresa.JPG' },
    { arquivo: 'home.JPG' },
    { arquivo: 'pudim.JPG' },
    { arquivo: 'pudim-2.JPG' },
    { arquivo: 'trufas.JPG' }
  ];
}
