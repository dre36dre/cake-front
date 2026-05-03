import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../models/produto.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CarrinhoService } from '../../services/carrinho.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  produtos$!: Observable<Produto[]>;

  constructor(private auth: AuthService,private produtoService: ProdutoService,  private carrinhoService: CarrinhoService) {}

  ngOnInit() {
    this.produtos$ = this.produtoService.listar();
  }

  adicionar(p: Produto) {
     this.carrinhoService.adicionar(p);
  }


mostrarLogin = false;
  email = '';
  password = '';


  abrirLogin() {
    this.mostrarLogin = true;
  }

  fecharLogin() {
    this.mostrarLogin = false;
  }

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);

        alert('Login OK');

        this.fecharLogin();

        if (res.role === 'admin') {
          window.location.href = '/admin';
        }
      },
      error: () => alert('Erro no login')
    });
  }

}