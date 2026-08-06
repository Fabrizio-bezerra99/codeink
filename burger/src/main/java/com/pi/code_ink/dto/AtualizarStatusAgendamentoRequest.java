package com.pi.code_ink.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AtualizarStatusAgendamentoRequest {

    @NotBlank(message = "O status e obrigatorio.")
    @Pattern(
            regexp = "Pendente|Confirmado|Cancelado|Finalizado",
            message = "Status invalido."
    )
    private String status;
}
