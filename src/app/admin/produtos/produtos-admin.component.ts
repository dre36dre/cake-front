import { CommonModule } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto.service';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-produtos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './produtos-admin.component.html',
  styleUrls: ['./produtos-admin.component.css']
})
export class ProdutosAdminComponent implements OnInit {

  produtos: Produto[] = [];
  carregando = true;
  erro = '';
  mensagem = '';
  salvandoId: number | null = null;

  imagensDisponiveis = [
    'beijinho.JPG',
    'bolo-pote.JPG',
    'bolo.JPG',
    'brigadeiros-recheados.jpg',
    'brigadeiros-tradicional.jpg',
    'copo-surpresa.JPG',
    'mini-pudim.JPG',
    'mousse.jpg',
    'pudim-2.JPG',
    'pudim-compartilhar.JPG',
    'pudim.JPG',
    'trufas.JPG'
  ];

  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');
  private timeoutId: any;

  constructor(
    private produtoService: ProdutoService,
    private cd: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit(): void {
    console.log('ProdutosAdminComponent inicializado');
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    // Timeout de segurança de 15 segundos
    this.timeoutId = setTimeout(() => {
      if (this.carregando) {
        this.erro = 'Timeout ao carregar produtos. Verifique se o backend está online e tente novamente.';
        console.error('Timeout ao carregar produtos');
      }
    }, 15000);

    this.produtoService.listar().pipe(
      finalize(() => {
        clearTimeout(this.timeoutId);
        this.carregando = false;
        Promise.resolve().then(() => {
          this.cd.detectChanges();
          this.appRef.tick();
        });
        console.log('Finalize carregarProdutos, carregando:', this.carregando);
      })
    ).subscribe({
      next: (produtos) => {
        console.log('Produtos carregados com sucesso:', produtos?.length, 'produtos');

        if (!Array.isArray(produtos)) {
          console.error('Resposta de produtos não é um array:', produtos);
          this.erro = 'Resposta inválida da API de produtos.';
          this.carregando = false;
          this.cd.detectChanges();
          return;
        }

        this.produtos = produtos.map((produto) => ({
          ...produto,
          imageUrl: this.nomeImagem(produto.imageUrl)
        }));
        this.carregando = false;
        this.cd.detectChanges();
        console.log('Produtos mapeados:', this.produtos.length);
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.carregando = false;
        this.cd.detectChanges();

        if (err?.name === 'TimeoutError') {
          this.erro = 'Timeout ao conectar com a API. O backend pode estar offline.';
        } else if (err?.status === 0) {
          this.erro = 'Não foi possível conectar à API. Verifique se o backend está online.';
        } else if (err?.status === 404) {
          this.erro = 'Endpoint de produtos não encontrado no backend.';
        } else {
          this.erro = 'Não foi possível carregar os produtos. Tente novamente.';
        }
      }
    });
  }

  salvar(produto: Produto) {
    this.salvandoId = produto.id;
    this.erro = '';
    this.mensagem = '';

    const produtoAtualizado: Produto = {
      ...produto,
      price: Number(produto.price),
      imageUrl: this.nomeImagem(produto.imageUrl)
    };

    // Verificar se há imagem para upload
    const imagemUpload = (produto as any).imagemUpload;
    if (imagemUpload) {
      // Usar FormData para enviar arquivo
      const formData = new FormData();
      formData.append('produto', JSON.stringify(produtoAtualizado));
      formData.append('imagem', imagemUpload);

      this.produtoService.atualizarComImagem(produto.id, formData).subscribe({
        next: (atualizado) => {
          produto.description = atualizado.description;
          produto.price = atualizado.price;
          produto.imageUrl = this.nomeImagem(atualizado.imageUrl);
          produto.available = atualizado.available;
          // Limpar dados de upload
          delete (produto as any).imagemUpload;
          delete (produto as any).imagemPreview;
          this.mensagem = `${produto.name} atualizado com sucesso (imagem incluída).`;
        },
        error: (err) => {
          console.error('Erro ao salvar produto com imagem:', err);
          this.erro = 'Não foi possível salvar o produto com a nova imagem. Tente novamente.';
        },
        complete: () => {
          this.salvandoId = null;
        }
      });
    } else {
      // Salvar sem imagem
      this.produtoService.atualizar(produto.id, produtoAtualizado).subscribe({
        next: (atualizado) => {
          produto.description = atualizado.description;
          produto.price = atualizado.price;
          produto.imageUrl = this.nomeImagem(atualizado.imageUrl);
          produto.available = atualizado.available;
          this.mensagem = `${produto.name} atualizado com sucesso.`;
        },
        error: (err) => {
          console.error('Erro ao salvar produto:', err);
          this.erro = 'Não foi possível salvar o produto. Tente novamente.';
        },
        complete: () => {
          this.salvandoId = null;
        }
      });
    }
  }

  imagemPreview(produto: Produto): string {
    const imagem = this.nomeImagem(produto.imageUrl);

    if (!imagem) {
      return 'assets/imagens/bolo.JPG';
    }

    if (imagem.startsWith('http://') || imagem.startsWith('https://') || imagem.startsWith('assets/')) {
      return imagem;
    }

    if (produto.imageUrl?.startsWith('/imagens/')) {
      return `${this.apiUrl}/imagens/${imagem}`;
    }

    return `assets/imagens/${imagem}`;
  }

  getImagemSrc(produto: Produto): string {
    const preview = (produto as any).imagemPreview;
    return preview || this.imagemPreview(produto);
  }

  getImagemUpload(produto: Produto): File | null {
    return (produto as any).imagemUpload || null;
  }

  usarImagemLocal(event: Event, produto: Produto) {
    const img = event.target as HTMLImageElement;
    const imagem = this.nomeImagem(produto.imageUrl) || 'bolo.JPG';

    img.src = `assets/imagens/${imagem}`;
  }

  onFileSelected(event: Event, produto: Produto) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        this.erro = 'Por favor, selecione apenas arquivos de imagem.';
        input.value = '';
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.erro = 'A imagem deve ter no máximo 5MB.';
        input.value = '';
        return;
      }

      // Armazenar o arquivo no produto
      (produto as any).imagemUpload = file;

      // Criar preview da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        (produto as any).imagemPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.erro = '';
    }
  }

  private nomeImagem(imageUrl: string): string {
    if (!imageUrl) {
      return '';
    }

    return imageUrl.split('/').pop() ?? imageUrl;
  }

  trackByProduto(index: number, produto: Produto): number {
    return produto.id;
  }
}
