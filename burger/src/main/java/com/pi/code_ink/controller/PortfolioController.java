// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.controller;

import com.pi.code_ink.dto.PortfolioRequest;
import com.pi.code_ink.dto.PortfolioResponse;
import com.pi.code_ink.service.PortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public ResponseEntity<List<PortfolioResponse>> listarTodos() {
        return ResponseEntity.ok(portfolioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PortfolioResponse> criar(@Valid @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PortfolioResponse> atualizar(@PathVariable Long id, @Valid @RequestBody PortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        portfolioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
