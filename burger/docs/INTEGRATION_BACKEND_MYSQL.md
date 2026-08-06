# Code Ink — Integração Backend Spring Boot + MySQL

## 1. Objetivo

Este documento ensina a preparar o ambiente local, conectar o backend Spring Boot ao MySQL e testar o primeiro endpoint real de agendamentos.

## 2. Estrutura local esperada

```text
CODEINK/
├── burger                         # backend Spring Boot
└── PI_ ou ProjetoIntegrador       # frontend Angular
```

O backend e o frontend são projetos separados. O backend deste documento está em `burger`.

## 3. Requisitos

- Java JDK 21
- Maven Wrapper do projeto (`mvnw.cmd`)
- MySQL Community Server 8.4 ou compatível
- Git
- Terminal do Windows, CMD ou PowerShell
- `curl`

## 4. Banco de dados MySQL

Execute os comandos abaixo no MySQL usando valores próprios. `SUA_SENHA_AQUI` é apenas um placeholder e nunca deve ser substituído por uma senha real neste arquivo.

```sql
CREATE DATABASE code_ink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'code_ink_app'@'localhost' IDENTIFIED BY 'SUA_SENHA_AQUI';

GRANT ALL PRIVILEGES ON code_ink.* TO 'code_ink_app'@'localhost';

FLUSH PRIVILEGES;

SHOW DATABASES;

SHOW GRANTS FOR 'code_ink_app'@'localhost';
```

A aplicação deve usar o usuário limitado `code_ink_app`. O usuário `root` não deve ser usado pela aplicação.

## 5. Configuração segura do datasource

O arquivo `src/main/resources/application.properties` usa variáveis de ambiente:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/code_ink}
spring.datasource.username=${DB_USERNAME:code_ink_app}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

- `DB_URL` tem como padrão a conexão local `jdbc:mysql://localhost:3306/code_ink`.
- `DB_USERNAME` tem como padrão `code_ink_app`.
- `DB_PASSWORD` deve ser definido no terminal antes de iniciar a aplicação.
- A senha real não deve ser salva neste arquivo, no README, em documentação ou no Git.
- `spring.jpa.hibernate.ddl-auto=update` permite que o Hibernate atualize o schema local conforme as entidades.

## 6. Como rodar o backend localmente

No Windows CMD:

```bat
cd /d "C:\Users\fabri\OneDrive\Documentos\Projeto Integrador\CODEINK\burger"

set "DB_USERNAME=code_ink_app"
set "DB_PASSWORD=SUA_SENHA_REAL_AQUI"

.\mvnw.cmd spring-boot:run
```

Digite a senha real somente no terminal local. Não salve esse valor em arquivos nem faça commit dele.

## 7. Como confirmar que o backend conectou no MySQL

Os sinais esperados no log incluem:

```text
HikariPool-1 - Start completed
Database JDBC URL [jdbc:mysql://localhost:3306/code_ink]
Tomcat started on port 8080
Started ProjetoIntegradorApplication
```

O nome exato de algumas mensagens pode variar conforme a versão do Spring Boot e do driver, mas devem aparecer a inicialização do pool, a URL JDBC, a porta 8080 e a mensagem de aplicação iniciada.

## 8. Endpoint validado

Endpoint:

```text
GET http://localhost:8080/api/agendamentos
```

Teste:

```bat
curl -i http://localhost:8080/api/agendamentos
```

Quando não houver registros, a resposta esperada é HTTP 200 com uma lista vazia:

```text
HTTP/1.1 200

[]
```

Com um registro de teste, a resposta esperada é semelhante a:

```json
[
  {
    "id": 1,
    "cliente": "João Silva",
    "artista": "Lucas Oliveira",
    "data": "25/08/2026",
    "horario": "14:00",
    "status": "Confirmado",
    "projeto": "Inspiração do portfólio"
  }
]
```

## 9. Registro manual de teste

Confira primeiro a estrutura atual da tabela:

```sql
SHOW COLUMNS FROM agendamentos;
```

Insira um registro de teste:

```sql
INSERT INTO agendamentos
    (cliente, artista, `data`, horario, status, projeto)
VALUES
    (
        'João Silva',
        'Lucas Oliveira',
        '25/08/2026',
        '14:00',
        'Confirmado',
        'Inspiração do portfólio'
    );
```

Confira o resultado:

```sql
SELECT * FROM agendamentos;
```

O campo `id` é gerado automaticamente pelo MySQL com `AUTO_INCREMENT`.

## 10. Problemas encontrados e soluções

| Problema | Causa | Solução |
|---|---|---|
| Java 8/JRE sem compilador `javac` | O ambiente não tinha um JDK compatível para compilar o projeto | Configuração do JDK 21 |
| Construtor duplicado nos DTOs vazios com Lombok | Anotações de geração de construtor produziam assinaturas duplicadas | Remoção de `@AllArgsConstructor` dos DTOs `Request` vazios |
| DataSource sem URL | O Spring Boot não tinha uma URL JDBC configurada | Configuração do datasource MySQL em `application.properties` |
| Senha do usuário `code_ink_app` inválida | Credencial ou permissão do usuário de aplicação estava incorreta | Redefinição da senha e das permissões do usuário de aplicação |
| `GET /api/agendamentos` retornando HTTP 500 `Not implemented yet` | O service ainda lançava `UnsupportedOperationException` | Implementação de `repository.findAll()` e do mapper de resposta |
| Endpoint retornando somente `id` | A entidade e o response DTO continham apenas o identificador | Inclusão dos campos mínimos no `AgendamentoResponse` e na entidade `Agendamento` |

## 11. Histórico de commits importantes

Os commits relevantes encontrados no histórico local são:

```text
06e1351 feat: add agendamento response fields
bfb386c feat: implement agendamentos listing
a647ef1 chore: configure MySQL datasource
5f0855d fix: remove duplicate constructors from empty DTOs
```

Para consultar o histórico mais recente:

```bat
git log --oneline -5
```

## 12. Próximos passos

- Corrigir a URL do Angular de `/agendamentos` para `/api/agendamentos`.
- Adaptar o `AgendamentoService` do Angular para consumir HTTP.
- Decidir a transição entre mocks/localStorage e a API real.
- Testar a chamada no navegador pela aba Network.
- Criar o fluxo real de cadastro e listagem de agendamentos.
- Revisar a diferença entre os status `Confirmado/Pendente/Finalizado/Cancelado` e `PENDENTE/CONFIRMADO/CONCLUIDO/CANCELADO`.
