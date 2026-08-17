# Code Ink — Backend

API REST do Code Ink responsável por autenticação, autorização e persistência dos fluxos integrados da aplicação. O backend recebe as requisições do frontend Angular em [`../PI_`](../PI_), aplica as regras no servidor e usa JPA para acessar o MySQL.

> Estado atual: autenticação e o fluxo principal de agendamentos estão funcionais. Outros controllers representam uma estrutura inicial e ainda não formam CRUDs completos.

## Tecnologias

- Java 21;
- Spring Boot 4.1;
- Spring Web MVC;
- Spring Security;
- Spring Data JPA;
- Bean Validation;
- MySQL Connector/J;
- JWT com JJWT 0.12.6;
- BCrypt;
- Lombok;
- Maven Wrapper;
- JUnit, MockMvc, Mockito e H2 para testes.

As versões e dependências são declaradas em [`pom.xml`](pom.xml).

## Organização

```text
src/main/java/com/pi/code_ink/
├── config/       # CORS e dados locais opcionais
├── controller/   # entrada HTTP da API
├── dto/          # contratos de entrada e saída
├── entity/       # entidades JPA
├── enums/        # perfis de acesso
├── exception/    # erros de negócio e respostas HTTP
├── mapper/       # conversão entre entidades e DTOs
├── repository/   # acesso ao banco com Spring Data JPA
├── security/     # filtro, emissão/validação JWT e regras de acesso
└── service/      # regras de aplicação
```

Um controller recebe a chamada HTTP; o service aplica a regra; o repository conversa com o banco; e o mapper evita expor diretamente a entidade na resposta.

## Banco de dados

O ambiente local usa MySQL e o schema padrão `code_ink`. O Hibernate está configurado com `ddl-auto=update` para desenvolvimento.

No fluxo integrado, `Agendamento` possui uma relação JPA `@ManyToOne` com `Usuario`:

```text
usuarios.id ← agendamentos.cliente_id
```

Ao criar um agendamento, o backend localiza o usuário pelo email autenticado no JWT, define a relação e força o status inicial `Pendente`. A listagem de “Meus agendamentos” resolve o usuário autenticado e consulta o repository por `cliente_id`.

## Autenticação e autorização

- cadastro público cria exclusivamente usuários `CLIENTE`;
- senhas são codificadas com BCrypt;
- login retorna um JWT assinado com HS256;
- a API não cria sessão no servidor;
- o filtro JWT valida o Bearer token e carrega o usuário;
- o Spring Security aplica regras para `CLIENTE`, `TATUADOR` e `ADMIN`;
- CORS permite o frontend local em `http://localhost:4200`.

O backend é a fonte de autoridade. O campo `cliente` enviado pelo navegador não é usado para definir o proprietário de um agendamento.

A matriz completa de acesso e a pendência conhecida em `/api/tatuadores/**` estão em [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md).

## Endpoints confirmados

### Funcionais no estado atual

| Método  | Endpoint                        | Acesso      | Finalidade                              |
| ------- | ------------------------------- | ----------- | --------------------------------------- |
| `POST`  | `/api/auth/cadastro`            | público     | cadastrar um cliente                    |
| `POST`  | `/api/auth/login`               | público     | autenticar e emitir JWT                 |
| `GET`   | `/api/auth/me`                  | autenticado | consultar a sessão atual                |
| `GET`   | `/api/agendamentos`             | `ADMIN`     | listar todos os agendamentos            |
| `GET`   | `/api/agendamentos/meus`        | `CLIENTE`   | listar agendamentos do próprio cliente  |
| `POST`  | `/api/agendamentos`             | `CLIENTE`   | criar agendamento para o cliente logado |
| `PATCH` | `/api/agendamentos/{id}/status` | `ADMIN`     | atualizar o status                      |

### Estrutura incompleta

Os controllers também declaram endpoints para agendamentos por ID, usuários, clientes, administradores, tatuadores, portfólios e pagamentos. Com exceção das operações listadas como funcionais acima, os respectivos services ainda possuem métodos não implementados. A presença de uma rota no controller não significa que o CRUD esteja pronto.

## Variáveis de ambiente

| Variável            | Obrigatória | Uso                                                     |
| ------------------- | ----------- | ------------------------------------------------------- |
| `DB_URL`            | não         | URL JDBC; padrão `jdbc:mysql://localhost:3306/code_ink` |
| `DB_USERNAME`       | não         | usuário do banco; padrão `code_ink_app`                 |
| `DB_PASSWORD`       | sim         | senha local do banco                                    |
| `JWT_SECRET`        | sim         | chave de assinatura com pelo menos 32 bytes             |
| `JWT_EXPIRATION_MS` | não         | validade do token; padrão `3600000` ms                  |

Defina valores sensíveis apenas no ambiente local. Não registre senhas, tokens ou uma chave JWT real em arquivos versionados.

Exemplo com placeholders:

```bash
export DB_URL='jdbc:mysql://localhost:3306/code_ink'
export DB_USERNAME='<usuario-local>'
export DB_PASSWORD='<senha-local>'
export JWT_SECRET='<segredo-local-com-pelo-menos-32-bytes>'
export JWT_EXPIRATION_MS='3600000'
```

## Como executar

Pré-requisitos:

- JDK 21;
- MySQL em execução;
- variáveis obrigatórias configuradas.

Na pasta `burger`:

```bash
bash mvnw spring-boot:run
```

A API usa por padrão `http://localhost:8080`.

Para preparar o banco com um usuário de aplicação limitado, consulte o [guia de integração com MySQL](docs/INTEGRATION_BACKEND_MYSQL.md).

## Testes e build

```bash
bash mvnw test
bash mvnw clean package
```

Validação confirmada em 17/08/2026:

- 25/25 testes aprovados;
- 0 failures;
- 0 errors;
- 0 skipped;
- `clean package` concluído com `BUILD SUCCESS`;
- JAR gerado em `target/code_ink-0.0.1-SNAPSHOT.jar`.

Os testes cobrem autenticação, BCrypt, JWT, perfis, respostas `401/403`, cadastro, agendamentos, atualização de status, ownership e consulta por ID do cliente.

## Limitações conhecidas

- `/api/tatuadores/**` ainda precisa de endurecimento das regras de autorização para operações de escrita;
- `TatuadorService` e os demais CRUDs auxiliares ainda estão incompletos;
- `GET /api/agendamentos/{id}`, `PUT /api/agendamentos/{id}` e `DELETE /api/agendamentos/{id}` estão declarados, mas não implementados no service;
- não há refresh token ou blacklist de logout;
- `ddl-auto=update` é uma conveniência de desenvolvimento, não uma estratégia de migrations para produção.

## Documentação técnica

- [Autenticação JWT e matriz de autorização](docs/AUTHENTICATION.md)
- [Integração Backend Spring Boot + MySQL](docs/INTEGRATION_BACKEND_MYSQL.md)
- [Contas locais de teste](docs/LOCAL_TEST_USERS.md)
