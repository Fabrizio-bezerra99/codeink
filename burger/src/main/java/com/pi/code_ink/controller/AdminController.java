// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.controller;

import com.pi.code_ink.dto.AdminRequest;
import com.pi.code_ink.dto.AdminResponse;
import com.pi.code_ink.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<AdminResponse>> listarTodos() {
        return ResponseEntity.ok(adminService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AdminResponse> criar(@Valid @RequestBody AdminRequest request) {
        return ResponseEntity.ok(adminService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminResponse> atualizar(@PathVariable Long id, @Valid @RequestBody AdminRequest request) {
        return ResponseEntity.ok(adminService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        adminService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
