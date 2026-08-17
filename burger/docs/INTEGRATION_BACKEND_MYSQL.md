# Code Ink — Integração Backend Spring Boot + MySQL

Atualizado em 17/08/2026 para refletir autenticação JWT, ownership por `cliente_id` e o fluxo real usado pelo frontend Angular.

## 1. Objetivo

Este documento ensina a preparar o ambiente local, conectar o backend Spring Boot ao MySQL e verificar o fluxo integrado de usuários e agendamentos.

## 2. Estrutura local esperada

```text
codeink/
├── burger/    # backend Spring Boot
└── PI_/       # frontend Angular
```

Backend e frontend são módulos do mesmo repositório. O backend deste documento está em `burger/`.

## 3. Requisitos

- Java JDK 21
- Maven Wrapper do projeto (`mvnw` ou `mvnw.cmd`)
- MySQL Community Server 8.4 ou compatível
- Git
- terminal compatível com o sistema operacional
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

app.jwt.secret=${JWT_SECRET}
app.jwt.expiration-ms=${JWT_EXPIRATION_MS:3600000}
```

- `DB_URL` tem como padrão a conexão local `jdbc:mysql://localhost:3306/code_ink`.
- `DB_USERNAME` tem como padrão `code_ink_app`.
- `DB_PASSWORD` deve ser definido no terminal antes de iniciar a aplicação.
- `JWT_SECRET` deve ser definido com pelo menos 32 bytes.
- `JWT_EXPIRATION_MS` tem como padrão `3600000` milissegundos.
- A senha real não deve ser salva neste arquivo, no README, em documentação ou no Git.
- `spring.jpa.hibernate.ddl-auto=update` permite que o Hibernate atualize o schema local conforme as entidades.

## 6. Como rodar o backend localmente

Em Bash:

```bash
cd burger
export DB_USERNAME='<usuario-local>'
export DB_PASSWORD='<senha-local>'
export JWT_SECRET='<segredo-local-com-pelo-menos-32-bytes>'
bash mvnw spring-boot:run
```

No PowerShell:

```powershell
Set-Location burger
$env:DB_USERNAME = '<usuario-local>'
$env:DB_PASSWORD = '<senha-local>'
$env:JWT_SECRET = '<segredo-local-com-pelo-menos-32-bytes>'
.\mvnw.cmd spring-boot:run
```

Substitua os placeholders somente no terminal local. Não salve valores reais em arquivos nem faça commit deles.

## 7. Como confirmar que o backend conectou no MySQL

Os sinais esperados no log incluem:

```text
HikariPool-1 - Start completed
Database JDBC URL [jdbc:mysql://localhost:3306/code_ink]
Tomcat started on port 8080
Started ProjetoIntegradorApplication
```

O nome exato de algumas mensagens pode variar conforme a versão do Spring Boot e do driver, mas devem aparecer a inicialização do pool, a URL JDBC, a porta 8080 e a mensagem de aplicação iniciada.

## 8. Fluxo validado

Em 17/08/2026, o seguinte fluxo foi validado manualmente pela interface:

```text
Angular
  → cadastro/login de CLIENTE
  → JWT no interceptor
  → POST /api/agendamentos
  → Spring resolve o usuário autenticado
  → MySQL grava agendamentos.cliente_id
  → GET /api/agendamentos/meus
  → perfil Angular
```

Também foram confirmados:

- status inicial `Pendente` definido pelo backend;
- `agendamentos.cliente_id = usuarios.id` do usuário autenticado;
- exibição do registro em “Meus agendamentos”;
- busca por ID do usuário, e não pelo nome enviado pelo navegador.

Os endpoints de agendamento são protegidos. `GET /api/agendamentos` exige `ADMIN`; `POST /api/agendamentos` e `GET /api/agendamentos/meus` exigem `CLIENTE`.

## 9. Verificação segura no MySQL

Depois de criar o agendamento pela aplicação, confira a estrutura da tabela:

```sql
SHOW COLUMNS FROM agendamentos;
```

Verifique somente o relacionamento, sem registrar nomes, emails ou credenciais no resultado:

```sql
SELECT
    a.id AS agendamento_id,
    a.status,
    a.cliente_id,
    u.id AS usuario_id
FROM agendamentos AS a
JOIN usuarios AS u ON u.id = a.cliente_id
ORDER BY a.id DESC;
```

O valor de `cliente_id` deve corresponder a `usuario_id`. Evite inserir o agendamento diretamente por SQL: a criação pela API é o que exercita autenticação, ownership, status inicial e persistência em conjunto.

## 10. Próximos passos

- Formalizar as transições permitidas entre os status de agendamento.
- Implementar validação de disponibilidade e conflito de horários.
- Concluir ou remover `GET`, `PUT` e `DELETE` por ID ainda não implementados no service.
- Criar um teste automatizado end-to-end envolvendo Angular, API e banco.
- Substituir `ddl-auto=update` por migrations versionadas antes de produção.
- Definir configurações e segredos próprios para cada ambiente.
