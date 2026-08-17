# Autenticação do Code Ink

Atualizado em 17/08/2026 com base em `AuthService`, `JwtFilter`, `JwtService`, `SecurityConfig` e nos testes de segurança do backend.

## Visão geral

O backend usa autenticação stateless: cada requisição protegida precisa apresentar um JWT no cabeçalho `Authorization`. A senha é validada com BCrypt e não é incluída nos DTOs de resposta.

```text
Angular -> Authorization: Bearer <token> -> JwtFilter
        -> Spring Security -> controller/service -> MySQL
```

## Configuração local

O backend exige uma chave JWT fora do Git:

```text
JWT_SECRET=<chave com pelo menos 32 bytes>
JWT_EXPIRATION_MS=3600000
```

`DB_PASSWORD` continua sendo fornecida somente pelo ambiente local. Nenhum valor real deve ser salvo neste repositório.

## Endpoints

### Cadastro público

`POST /api/auth/cadastro`

```json
{
  "nome": "Nome do cliente",
  "email": "cliente@example.com",
  "telefone": "21999999999",
  "senha": "<senha com pelo menos 8 caracteres>"
}
```

O backend normaliza o email, armazena a senha com BCrypt, define `CLIENTE` e retorna `201 Created` sem a senha. Email duplicado retorna `409 Conflict`.

### Login

`POST /api/auth/login`

```json
{
  "email": "cliente@example.com",
  "senha": "<senha cadastrada>"
}
```

A resposta retorna `token`, `tipo`, `usuarioId`, `nome`, `email` e `perfil`. Credenciais inválidas retornam `401 Unauthorized` com mensagem genérica.

### Usuário autenticado

`GET /api/auth/me` exige:

```text
Authorization: Bearer <token>
```

A resposta contém apenas `id`, `nome`, `email`, `telefone` e `perfil`.

## Perfis e autorização

- `CLIENTE`: a política de segurança permite criar agendamentos autenticados e consultar os próprios registros.
- `TATUADOR`: a política de segurança permite operações de escrita em portfólios.
- `ADMIN`: a política de segurança permite acessar endpoints administrativos e gerenciar agendamentos.
- O cadastro público não cria `TATUADOR` nem `ADMIN`.

Essas afirmações descrevem autorização, não implementação funcional. Uma requisição pode ser permitida pelo `SecurityConfig` e ainda alcançar um método não implementado no service. Atualmente, a gestão de agendamentos possui operações funcionais, enquanto `PortfolioService` e vários services administrativos ainda lançam `UnsupportedOperationException`.

Logout é local no frontend; não há blacklist nem refresh token nesta etapa.

## Como o JWT é validado

1. `JwtFilter` procura o prefixo `Bearer` no cabeçalho `Authorization`.
2. `JwtService` valida a assinatura HS256 e a expiração.
3. `CustomUserDetailsService` confirma que o usuário ainda existe no banco.
4. As authorities do usuário são carregadas no contexto do Spring Security.
5. `SecurityConfig` decide se o perfil pode acessar a operação.

O token inclui o email como subject, além do ID e do perfil. A chave usada para assinar o JWT é recebida por `JWT_SECRET`, deve ter pelo menos 32 bytes e nunca deve ser versionada.

## Matriz de autorização atual

A tabela representa somente a política de acesso configurada no Spring Security. Ela não afirma que todos os controllers e services correspondentes formem CRUDs funcionais.

| Operação                                                 | Regra atual                 |
| -------------------------------------------------------- | --------------------------- |
| `OPTIONS /**`                                            | pública                     |
| `POST /api/auth/cadastro`                                | pública                     |
| `POST /api/auth/login`                                   | pública                     |
| `GET /api/auth/me`                                       | qualquer perfil autenticado |
| `GET /api/portfolios/**`                                 | pública                     |
| `POST`, `PUT`, `DELETE /api/portfolios/**`               | `ADMIN` ou `TATUADOR`       |
| `GET /api/tatuadores/**`                                 | pública                     |
| `GET /api/agendamentos/meus`                             | `CLIENTE`                   |
| `POST /api/agendamentos`                                 | `CLIENTE`                   |
| demais `GET /api/agendamentos/**`                        | `ADMIN`                     |
| `PUT`, `PATCH`, `DELETE /api/agendamentos/**`            | `ADMIN`                     |
| `/api/admins/**`, `/api/usuarios/**`, `/api/clientes/**` | `ADMIN`                     |
| `/api/pagamentos/**`                                     | `ADMIN`                     |
| demais requisições não listadas                          | qualquer perfil autenticado |

A ordem dos matchers importa. Por exemplo, `/api/agendamentos/meus` aparece antes da regra geral de leitura administrativa de agendamentos para permitir o acesso do `CLIENTE` somente à sua coleção.

## Ownership de agendamentos

O navegador não é uma fonte confiável para definir o dono de um recurso. Por isso, embora `AgendamentoRequest` ainda possua um campo `cliente`, `AgendamentoService.criar()` não usa esse nome para estabelecer ownership.

O fluxo real é:

1. o `Principal` fornece o email autenticado;
2. o backend busca o `Usuario` correspondente;
3. `Agendamento.cliente` recebe essa entidade;
4. o JPA grava `agendamentos.cliente_id`;
5. `/api/agendamentos/meus` consulta `findByClienteId(usuario.getId())`.

Esse desenho evita que um cliente escolha outro proprietário alterando o payload e também diferencia usuários que tenham o mesmo nome.

## Angular: guard não é autorização

Os guards do Angular controlam a navegação e melhoram a experiência da interface. Eles não substituem as regras do servidor, porque código e estado do navegador podem ser manipulados.

O interceptor Angular adiciona o JWT às chamadas da API. Ainda assim, é o Spring Security que precisa responder `401 Unauthorized` quando não há autenticação válida e `403 Forbidden` quando o perfil autenticado não possui permissão.

## Pendência conhecida em `/api/tatuadores/**`

As operações de escrita de tatuadores ainda não possuem matchers específicos no `SecurityConfig`. Como somente o `GET` foi declarado público, `POST`, `PUT` e `DELETE` caem atualmente na regra final `anyRequest().authenticated()`.

Consequência confirmada manualmente em 17/08/2026: um `CLIENTE` autenticado atravessa a camada de autorização em `POST /api/tatuadores`. A requisição chega ao `TatuadorService.criar()` e termina em erro `500`, pois esse método ainda lança `UnsupportedOperationException`.

Isso não significa que o CRUD esteja funcional. Significa que há duas pendências independentes:

1. restringir a escrita aos perfis que forem definidos pelo requisito;
2. implementar e testar o service em uma etapa posterior.

A correção recomendada deve seguir o princípio do menor privilégio e incluir testes garantindo que um `CLIENTE` receba `403` antes de o service ser chamado. Esta documentação registra a limitação; o código de segurança não foi alterado nesta atualização documental.

## Limitações da sessão atual

- logout remove o token apenas do `sessionStorage`;
- não há refresh token;
- não há blacklist ou revogação imediata no servidor;
- a rota Angular `/agendamento` é pública, embora o backend exija `CLIENTE` no `POST`;
- contas `ADMIN` e `TATUADOR` precisam ser provisionadas fora do cadastro público.
