// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioRequest {

    @NotBlank
    private String nome;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String senha;
}
