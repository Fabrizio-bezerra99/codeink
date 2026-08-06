package com.pi.code_ink.controller;

import com.pi.code_ink.dto.CadastroClienteResponse;
import com.pi.code_ink.enums.Role;
import com.pi.code_ink.exception.ConflictException;
import com.pi.code_ink.exception.GlobalExceptionHandler;
import com.pi.code_ink.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthControllerTest {

    private AuthService authService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new AuthController(authService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void deveRetornar201ESemSenhaAoCadastrarCliente() throws Exception {
        when(authService.cadastrarCliente(any())).thenReturn(CadastroClienteResponse.builder()
                .id(1L)
                .nome("Maria Silva")
                .email("maria@exemplo.com")
                .telefone("21999999999")
                .perfil(Role.CLIENTE)
                .build());

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Maria Silva",
                                  "email": "Maria@Exemplo.com",
                                  "telefone": "21999999999",
                                  "senha": "senha-segura"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("maria@exemplo.com"))
                .andExpect(jsonPath("$.perfil").value("CLIENTE"))
                .andExpect(jsonPath("$.senha").doesNotExist());

        verify(authService).cadastrarCliente(any());
    }

    @Test
    void deveRetornar409QuandoEmailEstiverDuplicado() throws Exception {
        when(authService.cadastrarCliente(any()))
                .thenThrow(new ConflictException("Email já cadastrado."));

        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Maria Silva",
                                  "email": "maria@exemplo.com",
                                  "telefone": "21999999999",
                                  "senha": "senha-segura"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Email já cadastrado."));
    }

    @Test
    void deveRetornar400ParaSenhaMenorQueOitoCaracteres() throws Exception {
        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Maria Silva",
                                  "email": "maria@exemplo.com",
                                  "telefone": "21999999999",
                                  "senha": "1234567"
                                }
                                """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(authService);
    }

    @Test
    void deveRetornar400ParaEmailInvalido() throws Exception {
        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Maria Silva",
                                  "email": "email-invalido",
                                  "telefone": "21999999999",
                                  "senha": "senha-segura"
                                }
                                """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(authService);
    }
}
