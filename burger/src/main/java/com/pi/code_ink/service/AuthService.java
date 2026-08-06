package com.pi.code_ink.service;

import com.pi.code_ink.dto.CadastroClienteRequest;
import com.pi.code_ink.dto.CadastroClienteResponse;
import com.pi.code_ink.dto.LoginRequest;
import com.pi.code_ink.dto.LoginResponse;
import com.pi.code_ink.dto.UsuarioAutenticadoResponse;
import com.pi.code_ink.entity.Usuario;
import com.pi.code_ink.enums.Role;
import com.pi.code_ink.exception.ConflictException;
import com.pi.code_ink.exception.UnauthorizedException;
import com.pi.code_ink.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final com.pi.code_ink.security.JwtService jwtService;

    public CadastroClienteResponse cadastrarCliente(CadastroClienteRequest request) {
        String emailNormalizado = normalizarEmail(request.getEmail());

        if (usuarioRepository.existsByEmail(emailNormalizado)) {
            throw new ConflictException("Email já cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.getNome().trim())
                .email(emailNormalizado)
                .telefone(request.getTelefone().trim())
                .senha(passwordEncoder.encode(request.getSenha()))
                .perfil(Role.CLIENTE)
                .build();

        try {
            Usuario usuarioSalvo = usuarioRepository.save(usuario);
            return CadastroClienteResponse.builder()
                    .id(usuarioSalvo.getId())
                    .nome(usuarioSalvo.getNome())
                    .email(usuarioSalvo.getEmail())
                    .telefone(usuarioSalvo.getTelefone())
                    .perfil(usuarioSalvo.getPerfil())
                    .build();
        } catch (DataIntegrityViolationException exception) {
            throw new ConflictException("Email já cadastrado.");
        }
    }

    public LoginResponse login(LoginRequest request) {
        String emailNormalizado = normalizarEmail(request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(emailNormalizado, request.getSenha()));

            Usuario usuario = usuarioRepository.findByEmail(emailNormalizado)
                    .orElseThrow(() -> new UnauthorizedException("Email ou senha inválidos."));

            String token = jwtService.generateToken(
                    (UserDetails) authentication.getPrincipal(),
                    usuario.getId());

            return LoginResponse.builder()
                    .token(token)
                    .tipo("Bearer")
                    .usuarioId(usuario.getId())
                    .nome(usuario.getNome())
                    .email(usuario.getEmail())
                    .perfil(usuario.getPerfil())
                    .build();
        } catch (AuthenticationException exception) {
            throw new UnauthorizedException("Email ou senha inválidos.");
        }
    }

    public UsuarioAutenticadoResponse usuarioAutenticado(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new UnauthorizedException("Autenticação necessária.");
        }

        Usuario usuario = usuarioRepository.findByEmail(normalizarEmail(authentication.getName()))
                .orElseThrow(() -> new UnauthorizedException("Autenticação necessária."));

        return UsuarioAutenticadoResponse.builder()
                .id(usuario.getId())
                .nome(usuario.getNome())
                .email(usuario.getEmail())
                .telefone(usuario.getTelefone())
                .perfil(usuario.getPerfil())
                .build();
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
