import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from '../components/produtos/produtos.component';
import { ImagemHome, ImagensHomeService } from '../services/imagens-home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.component.html',
  styleUrls: ['./home.component.component.css']
})
export class HomeComponent implements OnInit {

  imagensHome: ImagemHome[] = [];
  imagemAmpliada: ImagemHome | null = null;

  constructor(private imagensHomeService: ImagensHomeService) {}

  ngOnInit(): void {
    this.imagensHomeService.listar().subscribe((data) => {
      this.imagensHome = data;
    });
  }

  getImagemSrc(arquivo: string): string {
    return this.imagensHomeService.getImagemSrc(arquivo);
  }

  alternarImagem(imagem: ImagemHome): void {
    this.imagemAmpliada = this.imagemAmpliada === imagem ? null : imagem;
  }

  isImagemAmpliada(imagem: ImagemHome): boolean {
    return this.imagemAmpliada === imagem;
  }
}
