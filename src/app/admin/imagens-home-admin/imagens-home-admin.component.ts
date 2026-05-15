import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagensHomeService, ImagemHome } from '../../services/imagens-home.service';

@Component({
  selector: 'app-imagens-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imagens-home-admin.component.html',
  styleUrls: ['./imagens-home-admin.component.css']
})
export class ImagensHomeAdminComponent implements OnInit {

  imagens: ImagemHome[] = [];
  carregando = false;
  erro = '';
  mensagem = '';
  salvando = false;

  constructor(
    private imagensService: ImagensHomeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarImagens();
  }

  carregarImagens(): void {
    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    this.imagensService.listar().subscribe({
      next: (imagens) => {
        this.imagens = imagens.map((imagem, index) => ({
          ...imagem,
          ordem: imagem.ordem ?? index + 1
        }));
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar imagens da home:', err);
        this.erro = 'Erro ao carregar imagens';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  adicionarImagem(): void {
    this.imagens.push({
      id: Date.now(),
      arquivo: '',
      titulo: '',
      ordem: this.imagens.length + 1
    });
    this.cdr.detectChanges();
  }

  removerImagem(index: number): void {
    const imagem = this.imagens[index];
    const confirmou = confirm(`Excluir "${imagem.titulo || imagem.arquivo || 'esta imagem'}" da home?`);

    if (!confirmou) {
      return;
    }

    this.imagens.splice(index, 1);
    this.reordenar();
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.imagensService.uploadImagem(file).subscribe({
        next: (res) => {
          this.imagens[index].arquivo = res.arquivo;
          if (!this.imagens[index].titulo) {
            this.imagens[index].titulo = this.nomeSemExtensao(file.name);
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao fazer upload da imagem:', err);
          this.erro = 'Erro ao fazer upload da imagem';
          this.cdr.detectChanges();
        }
      });
    }
  }

  salvar(): void {
    this.salvando = true;
    this.erro = '';
    this.mensagem = '';
    this.reordenar();

    this.imagensService.salvar(this.imagens).subscribe({
      next: () => {
        this.salvando = false;
        this.mensagem = 'Imagens salvas com sucesso.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao salvar imagens da home:', err);
        this.erro = 'Erro ao salvar imagens';
        this.salvando = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetar(): void {
    const confirmou = confirm('Restaurar as imagens originais da home?');

    if (!confirmou) {
      return;
    }

    this.imagensService.resetar().subscribe(() => {
      this.mensagem = 'Imagens originais restauradas.';
      this.carregarImagens();
    });
  }

  getImagemSrc(arquivo: string): string {
    return this.imagensService.getImagemSrc(arquivo);
  }

  trackByImagem(index: number, imagem: ImagemHome): number | string {
    return imagem.id ?? imagem.arquivo ?? index;
  }

  private reordenar(): void {
    this.imagens = this.imagens.map((imagem, index) => ({
      ...imagem,
      ordem: index + 1
    }));
  }

  private nomeSemExtensao(nomeArquivo: string): string {
    return nomeArquivo.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  }
}
