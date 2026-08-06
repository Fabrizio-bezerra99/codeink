// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.ClienteRequest;
import com.pi.code_ink.dto.ClienteResponse;
import com.pi.code_ink.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public List<ClienteResponse> listarTodos() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public ClienteResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public ClienteResponse criar(ClienteRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public ClienteResponse atualizar(Long id, ClienteRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
