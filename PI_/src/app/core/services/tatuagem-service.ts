import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tatuagem } from '../../models/tatuagem';

@Injectable({
  providedIn: 'root'
})
export class TatuagemService {

  private readonly apiUrl = 'http://localhost:8080/tatuagens';

  constructor(private http: HttpClient) {}

  listar(): Observable<Tatuagem[]> {
    return this.http.get<Tatuagem[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Tatuagem> {
    return this.http.get<Tatuagem>(`${this.apiUrl}/${id}`);
  }

  cadastrar(tatuagem: Tatuagem): Observable<Tatuagem> {
    return this.http.post<Tatuagem>(this.apiUrl, tatuagem);
  }

  atualizar(id: number, tatuagem: Tatuagem): Observable<Tatuagem> {
    return this.http.put<Tatuagem>(
      `${this.apiUrl}/${id}`,
      tatuagem
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}