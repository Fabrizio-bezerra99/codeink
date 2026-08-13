package com.pi.code_ink.security;

import java.io.IOException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .exceptionHandling(exceptionHandling -> exceptionHandling
                .authenticationEntryPoint((request, response, exception)
                        -> writeJsonError(response, HttpServletResponse.SC_UNAUTHORIZED,
                        "Autenticação necessária."))
                .accessDeniedHandler((request, response, exception)
                        -> writeJsonError(response, HttpServletResponse.SC_FORBIDDEN,
                        "Acesso negado.")))
                .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/cadastro", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/portfolios/**", "/api/tatuadores/**").permitAll()
                .requestMatchers("/api/admins/**", "/api/usuarios/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/agendamentos/meus")
                .hasRole("CLIENTE")
                .requestMatchers(HttpMethod.GET, "/api/agendamentos/**")
                .hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/agendamentos").hasRole("CLIENTE")
                .requestMatchers(HttpMethod.PUT, "/api/agendamentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/api/agendamentos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/agendamentos/**").hasRole("ADMIN")
                .requestMatchers("/api/clientes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/portfolios/**").hasAnyRole("ADMIN", "TATUADOR")
                .requestMatchers(HttpMethod.PUT, "/api/portfolios/**").hasAnyRole("ADMIN", "TATUADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/portfolios/**").hasAnyRole("ADMIN", "TATUADOR")
                .requestMatchers("/api/pagamentos/**").hasRole("ADMIN")
                .anyRequest().authenticated())
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private void writeJsonError(HttpServletResponse response, int status, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
                "{\"status\":" + status
                + ",\"error\":\""
                + (status == HttpServletResponse.SC_UNAUTHORIZED ? "Unauthorized" : "Forbidden")
                + "\",\"message\":\"" + message + "\"}");
    }
}
