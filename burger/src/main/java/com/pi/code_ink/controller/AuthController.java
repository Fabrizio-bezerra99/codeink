// Estrutura gerada automaticamente a partir do contrato dos services do Angular.
// Apenas esqueleto: sem regras de negocio, sem integracao com banco, sem validacoes.

package com.pi.code_ink.controller;

import com.pi.code_ink.dto.CadastroClienteRequest;
import com.pi.code_ink.dto.CadastroClienteResponse;
import com.pi.code_ink.dto.LoginRequest;
import com.pi.code_ink.dto.LoginResponse;
import com.pi.code_ink.dto.UsuarioAutenticadoResponse;
import com.pi.code_ink.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/cadastro")
    public ResponseEntity<CadastroClienteResponse> cadastrarCliente(
            @Valid @RequestBody CadastroClienteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.cadastrarCliente(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<UsuarioAutenticadoResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.usuarioAutenticado(authentication));
    }
}
