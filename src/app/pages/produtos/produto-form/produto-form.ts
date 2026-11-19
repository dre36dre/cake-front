import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProdutoService } from '../../../services/produtos.service';
import { Produto } from '../../../models/produto';

@Component({
  standalone: true,
  selector: 'app-produto-form',
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class ProdutoForm implements OnInit {
  produtoId?: number;
  produto: Produto = {
    name: '',
    description: '',
    price: 0,
    available: true,
    imageUrl: ''
  };
  imagemSelecionada: File | null = null;
  imagemPreview = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || id === 'novo') return;

    this.produtoId = Number(id);
    this.carregando = true;
    this.produtoService.getById(this.produtoId).subscribe({
      next: produto => {
        if (!produto) {
          this.erro = 'Produto não encontrado.';
        } else {
          this.produto = produto;
          this.imagemPreview = produto.imageUrl || '';
        }
        this.carregando = false;
      },
      error: error => {
        console.error('Erro ao carregar produto para edição:', error);
        this.erro = 'Não foi possível carregar o produto. Tente novamente.';
        this.carregando = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      this.erro = 'Escolha uma imagem JPG, PNG ou WebP de até 5 MB.';
      this.imagemSelecionada = null;
      this.imagemPreview = this.produto.imageUrl || '';
      input.value = '';
      return;
    }

    this.erro = '';
    this.imagemSelecionada = file;
    this.imagemPreview = URL.createObjectURL(file);
  }

  removerImagem(): void {
    this.imagemSelecionada = null;
    this.produto.imageUrl = null;
    this.imagemPreview = '';
  }

  async salvar(): Promise<void> {
    this.erro = '';
    this.sucesso = '';
    this.carregando = true;
    try {
      const imageUrl = this.imagemSelecionada
        ? await this.produtoService.uploadImage(this.imagemSelecionada, 'products')
        : this.produto.imageUrl || null;
      await firstValueFrom(this.produtoService.salvar({
        ...this.produto,
        id: this.produtoId,
        imageUrl
      }));
      this.sucesso = this.produtoId ? 'Produto atualizado.' : 'Produto cadastrado.';
      await this.router.navigate(['/admin/produtos']);
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      this.erro = error instanceof Error ? error.message : 'Não foi possível salvar o produto.';
    } finally {
      this.carregando = false;
    }
  }
}