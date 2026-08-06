package com.pi.code_ink.dto;

import com.pi.code_ink.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CadastroClienteResponse {

    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private Role perfil;
}
