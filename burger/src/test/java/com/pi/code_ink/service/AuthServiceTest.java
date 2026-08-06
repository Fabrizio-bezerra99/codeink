package com.pi.code_ink.service;

import com.pi.code_ink.dto.CadastroClienteRequest;
import com.pi.code_ink.dto.CadastroClienteResponse;
import com.pi.code_ink.entity.Usuario;
import com.pi.code_ink.enums.Role;
import com.pi.code_ink.exception.ConflictException;
import com.pi.code_ink.repository.UsuarioRepository;
import com.pi.code_ink.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    private UsuarioRepository usuarioRepository;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        usuarioRepository = mock(UsuarioRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        authenticationManager = mock(AuthenticationManager.class);
        jwtService = mock(JwtService.class);
        authService = new AuthService(
                usuarioRepository,
                passwordEncoder,
                authenticationManager,
                jwtService);
    }

    @Test
    void deveCadastrarClienteComEmailNormalizadoPerfilClienteESenhaHash() {
        CadastroClienteRequest request = new CadastroClienteRequest(
                " Maria Silva ",
                "  MARIA@EXEMPLO.COM  ",
                " (21) 99999-9999 ",
                "senha-segura"
        );
        when(usuarioRepository.existsByEmail("maria@exemplo.com")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenAnswer(invocation -> {
            Usuario usuario = invocation.getArgument(0);
            usuario.setId(1L);
            return usuario;
        });

        CadastroClienteResponse response = authService.cadastrarCliente(request);

        assertEquals(1L, response.getId());
        assertEquals("Maria Silva", response.getNome());
        assertEquals("maria@exemplo.com", response.getEmail());
        assertEquals("(21) 99999-9999", response.getTelefone());
        assertEquals(Role.CLIENTE, response.getPerfil());

        var captor = org.mockito.ArgumentCaptor.forClass(Usuario.class);
        verify(usuarioRepository).save(captor.capture());
        Usuario usuarioSalvo = captor.getValue();

        assertEquals("maria@exemplo.com", usuarioSalvo.getEmail());
        assertEquals(Role.CLIENTE, usuarioSalvo.getPerfil());
        assertNotEquals("senha-segura", usuarioSalvo.getSenha());
        assertTrue(passwordEncoder.matches("senha-segura", usuarioSalvo.getSenha()));
    }

    @Test
    void deveRejeitarEmailDuplicadoAntesDeSalvar() {
        CadastroClienteRequest request = new CadastroClienteRequest(
                "Maria Silva",
                "maria@exemplo.com",
                "21999999999",
                "senha-segura"
        );
        when(usuarioRepository.existsByEmail("maria@exemplo.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.cadastrarCliente(request));

        verify(usuarioRepository, never()).save(any(Usuario.class));
    }
}
