// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.TatuadorRequest;
import com.pi.code_ink.dto.TatuadorResponse;
import com.pi.code_ink.repository.TatuadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TatuadorService {

    private final TatuadorRepository tatuadorRepository;

    public List<TatuadorResponse> listarTodos() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public TatuadorResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public TatuadorResponse criar(TatuadorRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public TatuadorResponse atualizar(Long id, TatuadorRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
