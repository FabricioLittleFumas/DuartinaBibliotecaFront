import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Livro } from '../model/livro';

@Component({
  selector: 'app-mapa-museu',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mapa-museu.html'
})
export class MapaMuseu {
  @Input() obras: Livro[] = [];
  @Input() autenticado = false;
  @Input() carregando = false;

  trechoAtual = 0;
  obraSelecionada: Livro | null = null;
  readonly niveisEstante = [0, 1, 2, 3, 4, 5];

  readonly trechos = [
    { nome: 'Entrada', descricao: 'Você está na entrada da sala de leitura.' },
    { nome: 'Memória local', descricao: 'Siga pelo corredor e explore as estantes da biblioteca.' },
    { nome: 'Fundo da sala', descricao: 'Você chegou ao fundo da sala. As histórias continuam nas estantes.' }
  ];

  get obrasDaEstante(): Livro[] {
    return this.obras.slice(0, 8);
  }

  nomeAutores(obra: Livro): string {
    return obra.autores?.map(autor => autor.nome).join(', ') || 'Autoria não informada';
  }

  caminhar(trecho: number): void {
    this.trechoAtual = Math.max(0, Math.min(this.trechos.length - 1, trecho));
  }

  rolarLinhaDoTempo(event: WheelEvent): void {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 2) return;
    this.caminhar(this.trechoAtual + (event.deltaY < 0 ? -1 : 1));
  }

  abrirObra(obra: Livro): void {
    this.obraSelecionada = obra;
  }

  fecharObra(): void {
    this.obraSelecionada = null;
  }

  @HostListener('document:keydown.escape')
  aoPressionarEscape(): void {
    this.fecharObra();
  }
}
