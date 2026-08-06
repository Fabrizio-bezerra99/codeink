import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tatuador } from '../../models/tatuador';

@Injectable({
  providedIn: 'root'
})
export class TatuadorService {

  private readonly apiUrl = 'http://localhost:8080/tatuadores';

  constructor(private http: HttpClient) {}

  listar(): Observable<Tatuador[]> {
    return this.http.get<Tatuador[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Tatuador> {
    return this.http.get<Tatuador>(`${this.apiUrl}/${id}`);
  }

  cadastrar(tatuador: Tatuador): Observable<Tatuador> {
    return this.http.post<Tatuador>(this.apiUrl, tatuador);
  }

  atualizar(id: number, tatuador: Tatuador): Observable<Tatuador> {
    return this.http.put<Tatuador>(
      `${this.apiUrl}/${id}`,
      tatuador
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}