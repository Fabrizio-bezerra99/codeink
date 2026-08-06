package com.pi.code_ink.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * Gera e valida tokens JWT assinados com HS256.
 * O segredo de produção é fornecido exclusivamente por variável de ambiente.
 */
@Service
public class JwtService {

    private static final int MINIMUM_SECRET_BYTES = 32;

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms:3600000}") long expirationMs) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET não configurado.");
        }

        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < MINIMUM_SECRET_BYTES) {
            throw new IllegalStateException("JWT_SECRET deve ter pelo menos 32 bytes.");
        }

        if (expirationMs <= 0) {
            throw new IllegalStateException("JWT_EXPIRATION_MS deve ser maior que zero.");
        }

        this.signingKey = Keys.hmacShaKeyFor(secretBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(UserDetails userDetails, Long usuarioId) {
        String perfil = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Usuário sem perfil de acesso."));

        Instant issuedAt = Instant.now();

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("id", usuarioId)
                .claim("perfil", perfil)
                .issuedAt(Date.from(issuedAt))
                .expiration(Date.from(issuedAt.plusMillis(expirationMs)))
                .signWith(signingKey, Jwts.SIG.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public String extractPerfil(String token) {
        return extractClaims(token).get("perfil", String.class);
    }

    public Long extractUsuarioId(String token) {
        return extractClaims(token).get("id", Long.class);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            Claims claims = extractClaims(token);
            String username = claims.getSubject();
            Date expiration = claims.getExpiration();

            return username != null
                    && username.equals(userDetails.getUsername())
                    && expiration != null
                    && expiration.after(new Date());
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
