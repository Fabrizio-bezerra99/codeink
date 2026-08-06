package com.pi.code_ink.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pi.code_ink.entity.Usuario;
import com.pi.code_ink.enums.Role;
import com.pi.code_ink.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
class AuthSecurityIntegrationTest {

    private static final String TEST_SECRET =
            "test-only-jwt-signing-key-that-is-not-used-outside-tests";

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void limparUsuarios() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
        usuarioRepository.deleteAll();
    }

    @ParameterizedTest
    @EnumSource(Role.class)
    void deveFazerLoginComTodosOsPerfis(Role role) throws Exception {
        criarUsuario(role, "login-" + role.name().toLowerCase() + "@exemplo.com", "SenhaSegura123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "LOGIN-%s@EXEMPLO.COM",
                                  "senha": "SenhaSegura123"
                                }
                                """.formatted(role.name().toLowerCase())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.tipo").value("Bearer"))
                .andExpect(jsonPath("$.perfil").value(role.name()))
                .andExpect(jsonPath("$.senha").doesNotExist());
    }

    @Test
    void deveCadastrarClienteComBCryptESemRetornarSenha() throws Exception {
        mockMvc.perform(post("/api/auth/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Cliente Novo",
                                  "email": "CLIENTE.NOVO@EXEMPLO.COM",
                                  "telefone": "21999999999",
                                  "senha": "SenhaSegura123"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("cliente.novo@exemplo.com"))
                .andExpect(jsonPath("$.perfil").value("CLIENTE"))
                .andExpect(jsonPath("$.senha").doesNotExist());

        Usuario usuario = usuarioRepository.findByEmail("cliente.novo@exemplo.com").orElseThrow();
        assertEquals(Role.CLIENTE, usuario.getPerfil());
        assertNotNull(usuario.getSenha());
        assertNotNull(passwordEncoder);
        assertFalse(usuario.getSenha().equals("SenhaSegura123"));
        assertTrue(passwordEncoder.matches("SenhaSegura123", usuario.getSenha()));
    }

    @Test
    void deveRetornar401ComMensagemGenericaParaCredenciaisInvalidas() throws Exception {
        criarUsuario(Role.CLIENTE, "cliente@exemplo.com", "SenhaSegura123");

        String respostaSenhaInvalida = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "cliente@exemplo.com",
                                  "senha": "SenhaErrada123"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email ou senha inválidos."))
                .andExpect(jsonPath("$.trace").doesNotExist())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String respostaUsuarioInexistente = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "naoexiste@exemplo.com",
                                  "senha": "SenhaErrada123"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Email ou senha inválidos."))
                .andReturn()
                .getResponse()
                .getContentAsString();

        assertEquals(
                objectMapper.readTree(respostaSenhaInvalida).get("message"),
                objectMapper.readTree(respostaUsuarioInexistente).get("message"));
    }

    @Test
    void deveRetornarDadosSegurosNoMe() throws Exception {
        criarUsuario(Role.CLIENTE, "cliente@exemplo.com", "SenhaSegura123");

        String token = fazerLogin("cliente@exemplo.com", "SenhaSegura123");
        Usuario usuario = usuarioRepository.findByEmail("cliente@exemplo.com").orElseThrow();
        assertEquals(usuario.getId(), jwtService.extractUsuarioId(token));
        assertEquals("ROLE_CLIENTE", jwtService.extractPerfil(token));

        mockMvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("cliente@exemplo.com"))
                .andExpect(jsonPath("$.telefone").value("21999999999"))
                .andExpect(jsonPath("$.perfil").value("CLIENTE"))
                .andExpect(jsonPath("$.senha").doesNotExist());
    }

    @Test
    void deveRetornar401SemBearerEmRotaProtegida() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void deveRetornar401ParaTokenAdulteradoExpiradoOuUsuarioInexistente() throws Exception {
        criarUsuario(Role.CLIENTE, "cliente@exemplo.com", "SenhaSegura123");
        String tokenValido = fazerLogin("cliente@exemplo.com", "SenhaSegura123");

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + tokenValido + "adulterado"))
                .andExpect(status().isUnauthorized());

        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        String tokenExpirado = Jwts.builder()
                .subject("cliente@exemplo.com")
                .claim("perfil", "ROLE_CLIENTE")
                .issuedAt(new Date(System.currentTimeMillis() - 10_000))
                .expiration(new Date(System.currentTimeMillis() - 1_000))
                .signWith(key, Jwts.SIG.HS256)
                .compact();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + tokenExpirado))
                .andExpect(status().isUnauthorized());

        String tokenUsuarioInexistente = jwtService.generateToken(
                User.withUsername("inexistente@exemplo.com")
                        .password("nao-usada")
                        .roles("CLIENTE")
                        .build(),
                999L);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + tokenUsuarioInexistente))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void deveRetornar403QuandoClienteAcessarRotaDeAdministrador() throws Exception {
        criarUsuario(Role.CLIENTE, "cliente@exemplo.com", "SenhaSegura123");
        String token = fazerLogin("cliente@exemplo.com", "SenhaSegura123");

        mockMvc.perform(get("/api/usuarios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message").value("Acesso negado."));
    }

    private void criarUsuario(Role role, String email, String senha) {
        usuarioRepository.save(Usuario.builder()
                .nome(role.name() + " Teste")
                .email(email)
                .telefone("21999999999")
                .senha(passwordEncoder.encode(senha))
                .perfil(role)
                .build());
    }

    private String fazerLogin(String email, String senha) throws Exception {
        String resposta = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "senha": "%s"
                                }
                                """.formatted(email, senha)))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andReturn()
                .getResponse()
                .getContentAsString();

        JsonNode json = objectMapper.readTree(resposta);
        return json.get("token").asText();
    }
}
