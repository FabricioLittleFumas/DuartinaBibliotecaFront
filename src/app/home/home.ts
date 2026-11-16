import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth-service';
import { Livro } from '../model/livro';
import { AutorService } from '../service/autor-service';
import { LivroService } from '../service/livro-service';
import { AtalhosRapidos } from '../atalhos-rapidos/atalhos-rapidos';
import { TrilhasLeitura } from '../trilhas-leitura/trilhas-leitura';
import { ExperienciaLeitura } from '../experiencia-leitura/experiencia-leitura';
import { MapaMuseu } from '../mapa-museu/mapa-museu';

@Component({ standalone: true, selector: 'app-home', imports: [CommonModule, RouterLink, AtalhosRapidos, TrilhasLeitura, ExperienciaLeitura, MapaMuseu], templateUrl: './home.html', styleUrl: './home.css' })
export class Home implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly livrosApi = inject(LivroService);
  private readonly autoresApi = inject(AutorService);
  private authSub?: Subscription;
  loggedIn = this.auth.isLoggedIn();
  livros: Livro[] = [];
  todasObras: Livro[] = [];
  autores = 0;
  carregando = false;
  ngOnInit(): void { this.authSub = this.auth.authState$.subscribe(() => { this.loggedIn = this.auth.isLoggedIn(); if (this.loggedIn) this.carregar(); else { this.livros = []; this.todasObras = []; this.autores = 0; } }); if (this.loggedIn) this.carregar(); }
  ngOnDestroy(): void { this.authSub?.unsubscribe(); }
  nomesAutores(livro: Livro): string { return livro.autores?.map(autor => autor.nome).join(', ') || 'Autor não informado'; }
  private carregar(): void { this.carregando = true; this.livrosApi.listar().subscribe({ next: livros => { this.todasObras = livros; this.livros = livros.slice(0, 6); this.carregando = false; }, error: () => { this.carregando = false; } }); this.autoresApi.listar().subscribe({ next: autores => this.autores = autores.length, error: () => this.autores = 0 }); }
}
