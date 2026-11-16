import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Autor, NovoAutor } from '../model/autor';
import { AutorService } from '../service/autor-service';
import { mensagemErroApi } from '../utils/http-error-message';
import { AuthService } from '../auth-service';
@Component({standalone:true,selector:'app-autores',imports:[CommonModule,FormsModule],templateUrl:'./autores.html',styleUrl:'./catalogo.css'})
export class Autores implements OnInit {
  private readonly api = inject(AutorService);
  private readonly auth = inject(AuthService);
  get podeGerenciar(): boolean { return this.auth.isLoggedIn(); }
  autores: Autor[] = [];
  nomeBusca = '';
  editando: number | null = null;
  erro = '';
  salvando = false;
  form: NovoAutor = this.vazio();

  ngOnInit(): void { this.carregar(); }
  private vazio(): NovoAutor { return { nome: '', nacionalidade: '', biografia: '' }; }

  carregar(): void {
    this.api.listar(this.nomeBusca).subscribe({
      next: autores => { this.autores = autores; this.erro = ''; },
      error: error => { this.erro = mensagemErroApi(error as HttpErrorResponse, 'Não foi possível carregar autores'); }
    });
  }

  buscar(): void { this.carregar(); }
  editar(autor: Autor): void {
    if (!this.podeGerenciar) return;
    this.editando = autor.id;
    this.form = { nome: autor.nome, nacionalidade: autor.nacionalidade ?? '', biografia: autor.biografia ?? '' };
    this.erro = '';
  }
  cancelar(): void { this.editando = null; this.form = this.vazio(); this.erro = ''; }

  salvar(): void {
    if (!this.podeGerenciar) return;
    this.erro = '';
    if (!this.form.nome.trim()) { this.erro = 'Informe o nome do autor.'; return; }
    this.salvando = true;
    const requisicao = this.editando === null
      ? this.api.criar({ ...this.form, nome: this.form.nome.trim() })
      : this.api.atualizar(this.editando, { ...this.form, nome: this.form.nome.trim() });
    requisicao.subscribe({
      next: () => { this.salvando = false; this.cancelar(); this.carregar(); },
      error: error => {
        this.salvando = false;
        this.erro = mensagemErroApi(error as HttpErrorResponse, 'Não foi possível salvar o autor');
      }
    });
  }

  excluir(autor: Autor): void {
    if (!this.podeGerenciar) return;
    if (!confirm(`Excluir o autor “${autor.nome}”?`)) return;
    this.api.excluir(autor.id).subscribe({
      next: () => this.carregar(),
      error: error => { this.erro = mensagemErroApi(error as HttpErrorResponse, 'Não foi possível excluir o autor'); }
    });
  }
}
