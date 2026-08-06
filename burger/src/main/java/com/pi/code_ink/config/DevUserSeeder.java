package com.pi.code_ink.config;

import com.pi.code_ink.entity.Usuario;
import com.pi.code_ink.enums.Role;
import com.pi.code_ink.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Cria ou atualiza contas locais de teste somente quando o perfil seed-users
 * for ativado explicitamente.
 */
@Component
@Profile("seed-users")
@RequiredArgsConstructor
public class DevUserSeeder implements ApplicationRunner {

    private static final String TELEFONE_DE_TESTE = "00000000000";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    @Override
    public void run(ApplicationArguments args) {
        List<SeedUser> usuarios = List.of(
                new SeedUser("fabricio", "fabricio@gmail.com", Role.CLIENTE, "SEED_FABRICIO_PASSWORD"),
                new SeedUser("admin", "admin@gmail.com", Role.ADMIN, "SEED_ADMIN_PASSWORD"),
                new SeedUser("carlos", "carlos@gmail.com", Role.TATUADOR, "SEED_CARLOS_PASSWORD")
        );

        usuarios.forEach(this::salvarUsuario);
    }

    private void salvarUsuario(SeedUser seedUser) {
        String senha = senhaObrigatoria(seedUser.nomeVariavelSenha());

        Usuario usuario = usuarioRepository.findByEmail(seedUser.email())
                .orElseGet(Usuario::new);

        usuario.setNome(seedUser.nome());
        usuario.setEmail(seedUser.email());
        usuario.setTelefone(TELEFONE_DE_TESTE);
        usuario.setSenha(passwordEncoder.encode(senha));
        usuario.setPerfil(seedUser.perfil());

        usuarioRepository.save(usuario);
        System.out.printf("Usuário de teste preparado: %s (%s)%n", seedUser.email(), seedUser.perfil());
    }

    private String senhaObrigatoria(String nomeVariavel) {
        String senha = environment.getProperty(nomeVariavel);

        if (senha == null || senha.isBlank()) {
            throw new IllegalStateException("Defina a variável " + nomeVariavel + " antes de executar o seeder.");
        }

        if (senha.length() < 8) {
            throw new IllegalStateException("A variável " + nomeVariavel + " deve conter pelo menos 8 caracteres.");
        }

        return senha;
    }

    private record SeedUser(String nome, String email, Role perfil, String nomeVariavelSenha) {
    }
}
