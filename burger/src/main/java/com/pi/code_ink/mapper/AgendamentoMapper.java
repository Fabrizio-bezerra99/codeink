// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.mapper;

import com.pi.code_ink.dto.AgendamentoRequest;
import com.pi.code_ink.dto.AgendamentoResponse;
import com.pi.code_ink.entity.Agendamento;
import org.springframework.stereotype.Component;

@Component
public class AgendamentoMapper {

    public Agendamento toEntity(AgendamentoRequest request) {
        String status = request.getStatus();

        return Agendamento.builder()
                .cliente(request.getCliente())
                .artista(request.getArtista())
                .data(request.getData())
                .horario(request.getHorario())
                .status(status == null || status.isBlank() ? "Pendente" : status)
                .projeto(request.getProjeto())
                .build();
    }

    public AgendamentoResponse toResponse(Agendamento entity) {
        return AgendamentoResponse.builder()
                .id(entity.getId())
                .cliente(entity.getCliente())
                .artista(entity.getArtista())
                .data(entity.getData())
                .horario(entity.getHorario())
                .status(entity.getStatus())
                .projeto(entity.getProjeto())
                .build();
    }
}
