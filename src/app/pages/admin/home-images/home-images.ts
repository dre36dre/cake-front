import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HomeImage } from '../../../models/home-image';
import { HomeImagesService } from '../../../services/home-images.service';

@Component({
  selector: 'app-home-images-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home-images.html',
  styleUrls: ['./home-images.css']
})
export class HomeImagesAdmin implements OnInit {
  imagens: HomeImage[] = [];
  titulo = '';
  arquivo: File | null = null;
  preview = '';
  erro = '';
  carregando = false;
  salvando = false;

  constructor(private imagensService: HomeImagesService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.imagensService.listar().subscribe({
      next: imagens => {
        this.imagens = imagens;
        this.carregando = false;
      },
      error: error => {
        console.error('Erro ao carregar imagens da Home:', error);
        this.erro = error instanceof Error ? error.message : 'Não foi possível carregar as imagens.';
        this.carregando = false;
      }
    });
  }

  selecionarArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type) || arquivo.size > 5 * 1024 * 1024) {
      this.erro = 'Escolha uma imagem JPG, PNG ou WebP de até 5 MB.';
      this.arquivo = null;
      this.preview = '';
      input.value = '';
      return;
    }

    this.erro = '';
    this.arquivo = arquivo;
    this.preview = URL.createObjectURL(arquivo);
  }

  async adicionar(): Promise<void> {
    if (!this.titulo.trim() || !this.arquivo) return;
    this.erro = '';
    this.salvando = true;
    try {
      const imageUrl = await this.imagensService.upload(this.arquivo);
      await firstValueFrom(this.imagensService.criar(this.titulo, imageUrl));
      this.titulo = '';
      this.arquivo = null;
      this.preview = '';
      this.carregar();
    } catch (error) {
      console.error('Erro ao adicionar imagem da Home:', error);
      this.erro = error instanceof Error ? error.message : 'Não foi possível adicionar a imagem.';
    } finally {
      this.salvando = false;
    }
  }

  excluir(imagem: HomeImage): void {
    if (!confirm(`Remover a imagem "${imagem.title}" da Home?`)) return;
    this.imagensService.excluir(imagem.id).subscribe({
      next: () => this.carregar(),
      error: error => {
        console.error('Erro ao remover imagem da Home:', error);
        this.erro = error instanceof Error ? error.message : 'Não foi possível remover a imagem.';
      }
    });
  }
}
