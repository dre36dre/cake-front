import { CommonModule } from '@angular/common';
import { ApplicationRef, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';
import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produtos.service';
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
  salvandoIndex: number | null = null;

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
  private readonly imagensPorProduto: Record<string, string> = {
    'bolo de coco': 'bolo.JPG',
    'bolo': 'bolo.JPG',
    'brigadeiro': 'brigadeiros-tradicional.jpg',
    'brigadeiro recheado': 'brigadeiros-recheados.jpg',
    'mousse': 'mousse.jpg',
    'trufas': 'trufas.JPG',
    'bolo de pote': 'bolo-pote.JPG',
    'copo surpresa': 'copo-surpresa.JPG',
    'mini pudim': 'mini-pudim.JPG',
    'pudim para compartilhar': 'pudim-compartilhar.JPG',
    'pudim familia': 'pudim.JPG',
    'pudim família': 'pudim.JPG'
  };
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
        this.salvandoIndex = null;
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

        this.produtos = produtos;
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

  adicionarProduto() {
    this.produtos.push({
      id: null,
      name: '',
      description: '',
      price: 0,
      available: true,
      imageUrl: ''
    });
    this.cd.detectChanges();
  }

  deletarProduto(produto: Produto, index: number) {
    this.erro = '';
    this.mensagem = '';

    if (produto.id) {
      this.produtoService.deletar(produto.id).pipe(
        finalize(() => {
          this.cd.detectChanges();
        })
      ).subscribe({
        next: () => {
          this.produtos.splice(index, 1);
          this.mensagem = 'Produto removido com sucesso.';
        },
        error: (err) => {
          console.error('Erro ao deletar produto:', err);
          this.erro = 'Não foi possível excluir o produto. Tente novamente.';
        }
      });
      return;
    }

    this.produtos.splice(index, 1);
    this.cd.detectChanges();
  }

  salvar(produto: Produto) {
    const index = this.produtos.indexOf(produto);
    this.salvandoIndex = index;
    this.erro = '';
    this.mensagem = '';

    if (!produto.name || produto.name.trim() === '') {
      this.erro = 'O nome do produto é obrigatório.';
      this.salvandoIndex = null;
      return;
    }

    const produtoAtualizado: Produto = {
      ...produto,
      name: produto.name.trim(),
      price: Number(produto.price),
      imageUrl: produto.imageUrl?.trim() ?? ''
    };

    const isNewProduct = !produto.id;
    console.log('Salvando produto:', { isNew: isNewProduct, nome: produto.name, id: produto.id, imageUrl: produtoAtualizado.imageUrl });

    const concluirSalvar = (atualizado: Produto) => {
      produto.id = atualizado.id;
      produto.name = atualizado.name;
      produto.description = atualizado.description;
      produto.price = atualizado.price;
      produto.imageUrl = atualizado.imageUrl ?? '';
      produto.available = atualizado.available;
      delete (produto as any).imagemUpload;
      delete (produto as any).imagemPreview;
      this.mensagem = isNewProduct
        ? `${produto.name} criado com sucesso.`
        : `${produto.name} atualizado com sucesso.`;
      console.log('Produto salvo com sucesso:', produto);
    };

    const finalizar = () => {
      this.salvandoIndex = null;
      this.cd.detectChanges();
    };

    const processarSalvar = (imageUrl?: string) => {
      if (imageUrl) {
        produtoAtualizado.imageUrl = imageUrl;
        console.log('Image URL atualizada:', imageUrl);
      }

      const request$ = produto.id
        ? this.produtoService.atualizar(produto.id, produtoAtualizado)
        : this.produtoService.create(produtoAtualizado);

      request$.subscribe({
        next: (atualizado) => {
          console.log('Resposta do servidor:', atualizado);
          concluirSalvar(atualizado);
          this.salvandoIndex = null;
          if (isNewProduct) {
            console.log('Novo produto criado, recarregando lista...');
            const mensagemSalva = this.mensagem;
            this.carregarProdutos();
            Promise.resolve().then(() => {
              this.mensagem = mensagemSalva;
              this.cd.detectChanges();
            });
          } else {
            this.cd.detectChanges();
          }
        },
        error: (err) => {
          console.error('Erro ao salvar produto:', err);
          this.erro = 'Não foi possível salvar o produto. Tente novamente.';
          if (err?.error?.message) {
            this.erro += ` (${err.error.message})`;
          }
          this.salvandoIndex = null;
          this.cd.detectChanges();
        }
      });
    };

    const imagemUpload = (produto as any).imagemUpload as File | undefined;
    if (imagemUpload) {
      this.produtoService.uploadImagem(imagemUpload).subscribe({
        next: (url) => {
          console.log('Upload de imagem bem-sucedido:', url);
          processarSalvar(url);
        },
        error: (err) => {
          console.error('Erro ao enviar imagem:', err);
          console.warn('Salvando produto sem a nova imagem...');
          this.mensagem = 'Aviso: A imagem não foi enviada, mas o produto foi salvo.';
          processarSalvar();
        }
      });
    } else {
      processarSalvar();
    }
  }

  imagemPreview(produto: Produto): string {
    const imageUrl = produto.imageUrl?.trim();

    if (!imageUrl) {
      return this.imagemLocal(produto);
    }

    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:') || imageUrl.startsWith('assets/')) {
      return imageUrl;
    }

    const imagem = imageUrl.startsWith('/')
      ? imageUrl.split('/').pop() ?? ''
      : imageUrl;

    if (imagem.startsWith('cardapio-')) {
      return this.assetPath(imagem);
    }

    if (imageUrl.startsWith('/')) {
      return `${this.apiUrl}${imageUrl}`;
    }

    return `${this.apiUrl}/imagens/${imageUrl}`;
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

    img.src = this.imagemLocal(produto);
  }

  private assetPath(imagem: string): string {
    if (imagem.startsWith('cardapio-')) {
      return `assets/imagenshome/${imagem}`;
    }
    return `assets/imagens/${imagem}`;
  }

  private imagemLocal(produto: Produto): string {
    const nome = produto.name?.trim().toLowerCase() ?? '';
    const imagem = this.imagensPorProduto[nome] ?? 'bolo.JPG';

    return this.assetPath(imagem);
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

  trackByProduto(index: number, produto: Produto): number {
    return produto.id ?? index;
  }
}
