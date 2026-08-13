// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.repository;

import com.pi.code_ink.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByClienteId(Long clienteId);
}
