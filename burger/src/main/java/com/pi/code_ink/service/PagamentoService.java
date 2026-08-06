// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.PagamentoRequest;
import com.pi.code_ink.dto.PagamentoResponse;
import com.pi.code_ink.repository.PagamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;

    public List<PagamentoResponse> listarTodos() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public PagamentoResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public PagamentoResponse criar(PagamentoRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public PagamentoResponse atualizar(Long id, PagamentoRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
