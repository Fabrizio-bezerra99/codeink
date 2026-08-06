// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.UsuarioRequest;
import com.pi.code_ink.dto.UsuarioResponse;
import com.pi.code_ink.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioResponse> listarTodos() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public UsuarioResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public UsuarioResponse criar(UsuarioRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
