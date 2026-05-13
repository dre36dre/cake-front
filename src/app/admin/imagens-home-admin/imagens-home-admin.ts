import { Component, OnInit, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImagensHomeService, ImagemHome } from '../../services/imagens-home.service';

@Component({
  selector: 'app-imagens-home-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imagens-home-admin.html',
  styleUrl: './imagens-home-admin.css'
})
export class ImagensHomeAdminComponent implements OnInit {
  imagens: ImagemHome[] = [];
  carregando = false;
  erro = '';
  salvando = false;

  constructor(
    private imagensService: ImagensHomeService,
    private cdr: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {}

  ngOnInit() {
    this.carregarImagens();
  }

  carregarImagens() {
    this.carregando = true;
    this.imagensService.listar().subscribe({
      next: (imagens) => {
        if (imagens.length === 0) {
          // Inicializar com imagens padrão
          imagens = [
            { arquivo: 'home.JPG', titulo: 'Confeitaria da Dona' },
            { arquivo: 'bolo.JPG', titulo: 'Bolos' },
            { arquivo: 'brigadeiro-home.JPG', titulo: 'Brigadeiros' },
            { arquivo: 'brigadeiro-home-2.JPG', titulo: 'Brigadeiros especiais' },
            { arquivo: 'beijinho.JPG', titulo: 'Beijinhos' },
            { arquivo: 'pudim.JPG', titulo: 'Pudins' },
            { arquivo: 'pudim-2.JPG', titulo: 'Pudins especiais' },
            { arquivo: 'trufas.JPG', titulo: 'Trufas' },
            { arquivo: 'copo-surpresa.JPG', titulo: 'Copo surpresa' },
            { arquivo: 'cardapio-doces.JPG', titulo: 'Doces' },
            { arquivo: 'cardapio-festa.JPG', titulo: 'Festa' },
            { arquivo: 'cardapio-pudim.JPG', titulo: 'Cardapio pudim' }
          ];
          this.imagensService.salvar(imagens).subscribe();
        }
        this.imagens = imagens;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erro = 'Erro ao carregar imagens';
        this.carregando = false;
        console.error(err);
      }
    });
  }

  adicionarImagem() {
    this.imagens.push({ arquivo: '', titulo: '' });
    this.cdr.detectChanges();
  }

  removerImagem(index: number) {
    this.imagens.splice(index, 1);
    this.cdr.detectChanges();
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.imagensService.uploadImagem(file).subscribe({
        next: (res) => {
          this.imagens[index].arquivo = res.arquivo;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.erro = 'Erro ao fazer upload da imagem';
          console.error(err);
        }
      });
    }
  }

  salvar() {
    this.salvando = true;
    this.imagensService.salvar(this.imagens).subscribe({
      next: () => {
        this.salvando = false;
        alert('Imagens salvas com sucesso!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erro = 'Erro ao salvar imagens';
        this.salvando = false;
        console.error(err);
      }
    });
  }

  getImagemSrc(arquivo: string): string {
    if (arquivo.startsWith('http')) {
      return arquivo;
    }
    return `assets/imagenshome/${arquivo}`;
  }
}
