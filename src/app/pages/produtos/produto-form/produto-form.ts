import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../../services/produtos.service';
import { Produto } from '../../../models/produto';

@Component({
  standalone: true,
  selector: 'app-produto-form',
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.css'],
  imports: [CommonModule, FormsModule]
})
export class ProdutoForm {
  produto: Produto = {
    name: '',
    description: '',
    price: 0,
    available: true,
    imageUrl: ''
  };

  constructor(private produtoService: ProdutoService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.produto.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  salvar(): void {
    this.produtoService.create(this.produto).subscribe({
      next: (novo: Produto) => {
        console.log('Produto salvo com sucesso:', novo);
        alert('Produto cadastrado!');
        this.produto = { name: '', description: '', price: 0, available: true, imageUrl: '' };
      },
      error: (err: any) => console.error('Erro ao salvar produto', err)
    });
  }
}