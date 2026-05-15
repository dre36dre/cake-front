import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosComponent } from '../components/produtos/produtos.component';
import { ImagemHome, ImagensHomeService } from '../services/imagens-home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProdutosComponent],
  templateUrl: './home.component.component.html',
  styleUrls: ['./home.component.component.css']
})
export class HomeComponent implements OnInit {

  imagensHome: ImagemHome[] = [];

  constructor(private imagensHomeService: ImagensHomeService) {}

  ngOnInit(): void {
    this.imagensHomeService.listar().subscribe((data) => {
      this.imagensHome = data;
    });
  }

  getImagemSrc(arquivo: string): string {
    return this.imagensHomeService.getImagemSrc(arquivo);
  }
}
