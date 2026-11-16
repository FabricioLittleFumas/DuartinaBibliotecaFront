import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url';
import { Livro, LivroRequest } from '../model/livro';

@Injectable({ providedIn: 'root' })
export class LivroService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/livros`;
  listar(titulo = ''): Observable<Livro[]> { return this.http.get<Livro[]>(this.url, { params: titulo.trim() ? { titulo: titulo.trim() } : {} }); }
  buscar(id: number): Observable<Livro> { return this.http.get<Livro>(`${this.url}/${id}`); }
  criar(livro: LivroRequest): Observable<Livro> { return this.http.post<Livro>(this.url, livro); }
  atualizar(id: number, livro: LivroRequest): Observable<Livro> { return this.http.put<Livro>(`${this.url}/${id}`, livro); }
  excluir(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
