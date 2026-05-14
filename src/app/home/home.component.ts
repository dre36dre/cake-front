import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from '../components/produtos/produtos.component';

interface ImagemHome {
  arquivo: string;
  titulo: string;   // ✅ AQUI
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
    { arquivo: 'home.JPG', titulo: 'Home' },
    { arquivo: 'cardapio-doces.JPG', titulo: 'Cardápio Doces' },
    { arquivo: 'cardapio-festa.JPG', titulo: 'Cardápio Festa' },
    { arquivo: 'cardapio-pudim.JPG', titulo: 'Cardápio Pudim' },
    { arquivo: 'cardapio-pudim-editada.JPG', titulo: 'Cardápio Pudim Editado' },
    { arquivo: 'brigadeiro-home.JPG', titulo: 'Brigadeiro' },
    { arquivo: 'brigadeiro-home-2.JPG', titulo: 'Brigadeiro 2' },
    { arquivo: 'trufas.JPG', titulo: 'Trufas' },
    { arquivo: 'beijinho.JPG', titulo: 'Beijinho' },
    { arquivo: 'bolo.JPG', titulo: 'Bolo' },
    { arquivo: 'copo-surpresa.JPG', titulo: 'Copo Surpresa' },
    { arquivo: 'pudim.JPG', titulo: 'Pudim' },
    { arquivo: 'pudim-2.JPG', titulo: 'Pudim 2' }
    
  ];
}
