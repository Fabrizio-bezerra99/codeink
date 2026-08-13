package com.pi.code_ink.repository;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import com.pi.code_ink.entity.Agendamento;
import com.pi.code_ink.entity.Usuario;
import com.pi.code_ink.enums.Role;

import jakarta.persistence.EntityManager;

@DataJpaTest
class AgendamentoRepositoryTest {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    void deveSepararAgendamentosDeUsuariosComMesmoNomePeloId() {
        Usuario primeiroAlex = salvarUsuario("alex10@exemplo.com");
        Usuario segundoAlex = salvarUsuario("alex20@exemplo.com");
        assertNotEquals(primeiroAlex.getId(), segundoAlex.getId());

        Agendamento agendamentoDoPrimeiro = agendamentoRepository.save(
                novoAgendamento(primeiroAlex, "Projeto do primeiro Alex")
        );
        Agendamento agendamentoDoSegundo = agendamentoRepository.saveAndFlush(
                novoAgendamento(segundoAlex, "Projeto do segundo Alex")
        );
        entityManager.clear();

        List<Agendamento> agendamentosDoPrimeiro =
                agendamentoRepository.findByClienteId(primeiroAlex.getId());
        List<Agendamento> agendamentosDoSegundo =
                agendamentoRepository.findByClienteId(segundoAlex.getId());

        assertEquals(1, agendamentosDoPrimeiro.size());
        assertEquals(agendamentoDoPrimeiro.getId(), agendamentosDoPrimeiro.get(0).getId());
        assertEquals(primeiroAlex.getId(), agendamentosDoPrimeiro.get(0).getCliente().getId());

        assertEquals(1, agendamentosDoSegundo.size());
        assertEquals(agendamentoDoSegundo.getId(), agendamentosDoSegundo.get(0).getId());
        assertEquals(segundoAlex.getId(), agendamentosDoSegundo.get(0).getCliente().getId());
    }

    private Usuario salvarUsuario(String email) {
        return usuarioRepository.saveAndFlush(Usuario.builder()
                .nome("Alex")
                .email(email)
                .telefone("21999999999")
                .senha("senha-de-teste")
                .perfil(Role.CLIENTE)
                .build());
    }

    private Agendamento novoAgendamento(Usuario cliente, String projeto) {
        return Agendamento.builder()
                .cliente(cliente)
                .artista("Artista Teste")
                .data("30/08/2026")
                .horario("15:00")
                .status("Pendente")
                .projeto(projeto)
                .build();
    }
}
