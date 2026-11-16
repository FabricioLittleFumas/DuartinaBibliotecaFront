import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-base-url';
import { Autor, NovoAutor } from '../model/autor';

@Injectable({ providedIn: 'root' })
export class AutorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_BASE_URL}/autores`;
  listar(nome = ''): Observable<Autor[]> { return this.http.get<Autor[]>(this.url, { params: nome.trim() ? { nome: nome.trim() } : {} }); }
  buscar(id: number): Observable<Autor> { return this.http.get<Autor>(`${this.url}/${id}`); }
  criar(autor: NovoAutor): Observable<Autor> { return this.http.post<Autor>(this.url, autor); }
  atualizar(id: number, autor: NovoAutor): Observable<Autor> { return this.http.put<Autor>(`${this.url}/${id}`, autor); }
  excluir(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`); }
}
