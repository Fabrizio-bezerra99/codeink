// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.controller;

import com.pi.code_ink.dto.TatuadorRequest;
import com.pi.code_ink.dto.TatuadorResponse;
import com.pi.code_ink.service.TatuadorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tatuadores")
@RequiredArgsConstructor
public class TatuadorController {

    private final TatuadorService tatuadorService;

    @GetMapping
    public ResponseEntity<List<TatuadorResponse>> listarTodos() {
        return ResponseEntity.ok(tatuadorService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TatuadorResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tatuadorService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TatuadorResponse> criar(@Valid @RequestBody TatuadorRequest request) {
        return ResponseEntity.ok(tatuadorService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TatuadorResponse> atualizar(@PathVariable Long id, @Valid @RequestBody TatuadorRequest request) {
        return ResponseEntity.ok(tatuadorService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tatuadorService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
