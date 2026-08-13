package com.pi.code_ink.service;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.pi.code_ink.dto.AgendamentoRequest;
import com.pi.code_ink.dto.AgendamentoResponse;
import com.pi.code_ink.dto.AtualizarStatusAgendamentoRequest;
import com.pi.code_ink.entity.Agendamento;
import com.pi.code_ink.entity.Usuario;
import com.pi.code_ink.enums.Role;
import com.pi.code_ink.exception.NotFoundException;
import com.pi.code_ink.mapper.AgendamentoMapper;
import com.pi.code_ink.repository.AgendamentoRepository;
import com.pi.code_ink.repository.UsuarioRepository;
import org.mockito.ArgumentCaptor;

class AgendamentoServiceTest {

    private AgendamentoRepository agendamentoRepository;
    private UsuarioRepository usuarioRepository;
    private AgendamentoMapper agendamentoMapper;
    private AgendamentoService agendamentoService;

    @BeforeEach
    void setUp() {
        agendamentoRepository = mock(AgendamentoRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);

        // Usamos o mapper real, pois ele apenas transforma Entity em DTO.
        agendamentoMapper = new AgendamentoMapper();

        agendamentoService = new AgendamentoService(
                agendamentoRepository,
                usuarioRepository,
                agendamentoMapper
        );
    }

    @Test
    void deveUsarUsuarioAutenticadoEStatusPendenteAoCriarAgendamento() {
        AgendamentoRequest request = new AgendamentoRequest();
        request.setCliente("Outra Pessoa");
        request.setArtista("Lucas Oliveira");
        request.setData("30/08/2026");
        request.setHorario("15:00");
        request.setStatus("Finalizado");
        request.setProjeto("Inspiração do portfólio");

        Usuario usuarioAutenticado = Usuario.builder()
                .id(10L)
                .nome("Fabrício")
                .email("fabricio@exemplo.com")
                .perfil(Role.CLIENTE)
                .build();

        when(usuarioRepository.findByEmail("fabricio@exemplo.com"))
                .thenReturn(Optional.of(usuarioAutenticado));
        when(agendamentoRepository.save(any(Agendamento.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AgendamentoResponse response = agendamentoService.criar(
                request,
                "fabricio@exemplo.com"
        );

        ArgumentCaptor<Agendamento> captor = ArgumentCaptor.forClass(Agendamento.class);
        verify(agendamentoRepository).save(captor.capture());

        Agendamento agendamentoSalvo = captor.getValue();
        assertSame(usuarioAutenticado, agendamentoSalvo.getCliente());
        assertEquals("Pendente", agendamentoSalvo.getStatus());
        assertEquals("Fabrício", response.getCliente());
        assertEquals("Pendente", response.getStatus());
        verify(usuarioRepository).findByEmail("fabricio@exemplo.com");
    }

    @Test
    void deveListarAgendamentosPeloIdDoUsuarioAutenticado() {
        Usuario usuarioAutenticado = Usuario.builder()
                .id(10L)
                .nome("Alex")
                .email("alex10@exemplo.com")
                .perfil(Role.CLIENTE)
                .build();
        Agendamento agendamentoDoUsuario = Agendamento.builder()
                .id(100L)
                .cliente(usuarioAutenticado)
                .status("Pendente")
                .build();

        when(usuarioRepository.findByEmail("alex10@exemplo.com"))
                .thenReturn(Optional.of(usuarioAutenticado));
        when(agendamentoRepository.findByClienteId(10L))
                .thenReturn(List.of(agendamentoDoUsuario));

        List<AgendamentoResponse> response =
                agendamentoService.listarMeus("alex10@exemplo.com");

        assertEquals(1, response.size());
        assertEquals(100L, response.get(0).getId());
        assertEquals("Alex", response.get(0).getCliente());
        verify(agendamentoRepository).findByClienteId(10L);
    }

    @Test
    void deveAtualizarSomenteOStatusDoAgendamento() {
        Usuario cliente = Usuario.builder()
                .id(1L)
                .nome("Joao Silva")
                .build();
        Agendamento agendamento = Agendamento.builder()
                .id(1L)
                .cliente(cliente)
                .artista("Lucas Oliveira")
                .data("30/08/2026")
                .horario("15:00")
                .status("Pendente")
                .projeto("Inspiracao do portfolio")
                .build();

        AtualizarStatusAgendamentoRequest request =
                new AtualizarStatusAgendamentoRequest();
        request.setStatus("Confirmado");

        when(agendamentoRepository.findById(1L))
                .thenReturn(Optional.of(agendamento));

        when(agendamentoRepository.save(agendamento))
                .thenReturn(agendamento);

        AgendamentoResponse response =
                agendamentoService.atualizarStatus(1L, request);

        assertEquals("Confirmado", response.getStatus());
        assertEquals("Joao Silva", response.getCliente());
        assertEquals("Lucas Oliveira", response.getArtista());
        assertEquals("30/08/2026", response.getData());
        assertEquals("15:00", response.getHorario());
        assertEquals(
                "Inspiracao do portfolio",
                response.getProjeto()
        );

        verify(agendamentoRepository).save(agendamento);
    }

    @Test
    void deveLancarExcecaoQuandoAgendamentoNaoExistir() {
        AtualizarStatusAgendamentoRequest request =
                new AtualizarStatusAgendamentoRequest();
        request.setStatus("Cancelado");

        when(agendamentoRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                NotFoundException.class,
                () -> agendamentoService.atualizarStatus(99L, request)
        );

        verify(agendamentoRepository, never()).save(any());
    }
}
