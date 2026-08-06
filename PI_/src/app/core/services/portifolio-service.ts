import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Portfolio } from '../../models/portifolio';

@Injectable({
  providedIn: 'root'
})
export class PortifolioService {

  private readonly apiUrl = 'http://localhost:8080/portifolios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Portfolio[]> {
  return this.http.get<Portfolio[]>(this.apiUrl);
}

buscarPorId(id: number): Observable<Portfolio> {
  return this.http.get<Portfolio>(`${this.apiUrl}/${id}`);
}

cadastrar(portfolio: Portfolio): Observable<Portfolio> {
  return this.http.post<Portfolio>(this.apiUrl, portfolio);
}

atualizar(
  id: number,
  portfolio: Portfolio
): Observable<Portfolio> {
  return this.http.put<Portfolio>(
    `${this.apiUrl}/${id}`,
    portfolio
  );
}

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}