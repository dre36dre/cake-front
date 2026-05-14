import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from '../components/produtos/produtos.component';
import { HttpClient } from '@angular/common/http';

interface ImagemHome {
  id: number;
  url: string;
  ordem: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProdutosComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  imagensHome: ImagemHome[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<ImagemHome[]>('https://cake-api-production.up.railway.app/imagens-home')
      .subscribe({
        next: (dados) => {
          this.imagensHome = dados;
        },
        error: (err) => {
          console.error('Erro ao carregar imagens da home:', err);
        }
      });
  }
}
