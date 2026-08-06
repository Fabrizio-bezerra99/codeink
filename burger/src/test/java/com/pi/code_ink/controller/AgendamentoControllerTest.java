package com.pi.code_ink.controller;

import com.pi.code_ink.dto.AgendamentoResponse;
import com.pi.code_ink.dto.AtualizarStatusAgendamentoRequest;
import com.pi.code_ink.exception.GlobalExceptionHandler;
import com.pi.code_ink.exception.NotFoundException;
import com.pi.code_ink.service.AgendamentoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AgendamentoControllerTest {

    private AgendamentoService agendamentoService;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        agendamentoService = mock(AgendamentoService.class);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new AgendamentoController(agendamentoService))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void deveAtualizarStatusComSucesso() throws Exception {
        AgendamentoResponse response = AgendamentoResponse.builder()
                .id(1L)
                .cliente("Joao Silva")
                .artista("Lucas Oliveira")
                .data("30/08/2026")
                .horario("15:00")
                .status("Confirmado")
                .projeto("Inspiracao do portfolio")
                .build();
        when(agendamentoService.atualizarStatus(eq(1L), any(AtualizarStatusAgendamentoRequest.class)))
                .thenReturn(response);

        mockMvc.perform(patch("/api/agendamentos/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Confirmado\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("Confirmado"));

        verify(agendamentoService).atualizarStatus(eq(1L), any(AtualizarStatusAgendamentoRequest.class));
    }

    @Test
    void deveRetornarNotFoundQuandoAgendamentoNaoExistir() throws Exception {
        when(agendamentoService.atualizarStatus(eq(99L), any(AtualizarStatusAgendamentoRequest.class)))
                .thenThrow(new NotFoundException("Agendamento nao encontrado com o id: 99"));

        mockMvc.perform(patch("/api/agendamentos/99/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Cancelado\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Agendamento nao encontrado com o id: 99"));
    }

    @Test
    void deveRejeitarStatusVazio() throws Exception {
        mockMvc.perform(patch("/api/agendamentos/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"   \"}"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(agendamentoService);
    }

    @Test
    void deveRejeitarStatusForaDaListaPermitida() throws Exception {
        mockMvc.perform(patch("/api/agendamentos/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"Em andamento\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Status invalido."));

        verifyNoInteractions(agendamentoService);
    }
}
