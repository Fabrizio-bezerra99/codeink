// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.PortfolioRequest;
import com.pi.code_ink.dto.PortfolioResponse;
import com.pi.code_ink.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;

    public List<PortfolioResponse> listarTodos() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public PortfolioResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public PortfolioResponse criar(PortfolioRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public PortfolioResponse atualizar(Long id, PortfolioRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
