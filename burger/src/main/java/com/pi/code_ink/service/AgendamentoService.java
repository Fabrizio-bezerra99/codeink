// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.service;

import com.pi.code_ink.dto.AgendamentoRequest;
import com.pi.code_ink.dto.AgendamentoResponse;
import com.pi.code_ink.dto.AtualizarStatusAgendamentoRequest;
import com.pi.code_ink.entity.Agendamento;
import com.pi.code_ink.exception.NotFoundException;
import com.pi.code_ink.mapper.AgendamentoMapper;
import com.pi.code_ink.repository.AgendamentoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final AgendamentoMapper agendamentoMapper;

    public List<AgendamentoResponse> listarTodos() {
        return agendamentoRepository.findAll().stream()
                .map(agendamentoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public AgendamentoResponse buscarPorId(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public AgendamentoResponse criar(AgendamentoRequest request) {
        Agendamento agendamento = agendamentoMapper.toEntity(request);
        Agendamento agendamentoSalvo = agendamentoRepository.save(agendamento);
        return agendamentoMapper.toResponse(agendamentoSalvo);
    }

    public AgendamentoResponse atualizar(Long id, AgendamentoRequest request) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    public AgendamentoResponse atualizarStatus(Long id, AtualizarStatusAgendamentoRequest request) {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Agendamento nao encontrado com o id: " + id));

        agendamento.setStatus(request.getStatus());

        Agendamento agendamentoAtualizado = agendamentoRepository.save(agendamento);
        return agendamentoMapper.toResponse(agendamentoAtualizado);
    }

    public void deletar(Long id) {
        throw new UnsupportedOperationException("Not implemented yet");
    }
}
