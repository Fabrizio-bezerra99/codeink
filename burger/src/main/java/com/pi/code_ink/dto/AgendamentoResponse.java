// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AgendamentoResponse {

    private Long id;

    private String cliente;
    private String artista;
    private String data;
    private String horario;
    private String status;
    private String projeto;
}
