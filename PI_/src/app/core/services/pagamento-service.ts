import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pagamento } from '../../models/pagamento';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  private readonly apiUrl = 'http://localhost:8080/pagamentos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Pagamento> {
    return this.http.get<Pagamento>(
      `${this.apiUrl}/${id}`
    );
  }

  cadastrar(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(
      this.apiUrl,
      pagamento
    );
  }

  atualizar(
    id: number,
    pagamento: Pagamento
  ): Observable<Pagamento> {
    return this.http.put<Pagamento>(
      `${this.apiUrl}/${id}`,
      pagamento
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}