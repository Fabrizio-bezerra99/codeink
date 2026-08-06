// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.AdminRequest;
import com.pi.code_ink.dto.AdminResponse;
import com.pi.code_ink.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository adminRepository;

    public List<AdminResponse> listarTodos() {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public AdminResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public AdminResponse criar(AdminRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public AdminResponse atualizar(Long id, AdminRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
