# Code Ink

Aplicação Full Stack para apresentar um estúdio de tatuagem e centralizar a jornada de seus clientes, do cadastro ao acompanhamento de agendamentos. O projeto reúne um frontend Angular, uma API Spring Boot e persistência em MySQL no mesmo repositório.

> Projeto acadêmico em evolução, organizado como portfólio técnico. Os fluxos descritos abaixo correspondem ao que está implementado ou validado atualmente; funcionalidades incompletas são identificadas como limitações.

## Sobre o projeto

O Code Ink foi criado para aproximar clientes e estúdio em uma única experiência web. A aplicação combina um catálogo visual de trabalhos com autenticação, perfis de acesso e um fluxo real de agendamento associado ao usuário autenticado.

Além da interface, o projeto demonstra a integração entre diferentes camadas de uma aplicação: o Angular envia requisições HTTP, o Spring Boot aplica regras de negócio e segurança, e o MySQL persiste usuários e agendamentos.

## Funcionalidades principais

- catálogo visual local com home, portfólio, flash tattoos e tatuadores;
- busca, filtros e páginas de detalhes do catálogo;
- cadastro e login de clientes pela API;
- sessão autenticada com JWT e restauração por `/api/auth/me`;
- perfil do cliente protegido no Angular;
- criação e consulta dos próprios agendamentos pela API, com persistência no MySQL;
- interface administrativa para listar agendamentos e atualizar status pela API.

## Arquitetura

```text
Angular
   ↓ HTTP + JWT
Spring Boot / Spring Security
   ↓ JPA
MySQL
```

O frontend cuida da apresentação e da experiência de navegação. O backend valida o token, aplica as regras de autorização e controla a persistência. O MySQL armazena usuários e agendamentos.

## Tecnologias

### Frontend

- Angular 21;
- TypeScript 5.9;
- RxJS;
- HTML5 e CSS3;
- Vitest e jsdom.

### Backend

- Java 21;
- Spring Boot 4.1;
- Spring Web MVC;
- Spring Security;
- Spring Data JPA;
- Bean Validation;
- JWT com JJWT;
- BCrypt;
- Maven Wrapper.

### Banco e ferramentas

- MySQL;
- H2 nos testes do backend;
- Git e GitHub;
- npm.

As versões declaradas podem ser consultadas no [package.json do frontend](PI_/package.json) e no [pom.xml do backend](burger/pom.xml).

## Segurança

- senhas armazenadas com hash BCrypt, nunca em texto puro;
- autenticação stateless com JWT enviado no cabeçalho `Authorization: Bearer`;
- perfis `CLIENTE`, `TATUADOR` e `ADMIN`;
- interceptor Angular para anexar o token às chamadas da API;
- guards Angular para orientar a navegação por perfil;
- regras do Spring Security para a autorização efetiva no servidor.

Um guard no Angular funciona como uma barreira de navegação na interface, mas pode ser contornado no navegador. A proteção real de dados e operações deve permanecer no backend.

## Estrutura do repositório

```text
codeink/
├── PI_/       # frontend Angular
├── burger/    # backend Spring Boot
└── README.md  # visão Full Stack do projeto
```

- [README do frontend](PI_/README.md): detalhes da aplicação Angular;
- [README do backend](burger/README.md): detalhes da API e do banco;
- [Arquitetura](PI_/docs/ARCHITECTURE.md): fluxos e responsabilidades das camadas.

## Como executar localmente

### Pré-requisitos

- Java JDK 21;
- Node.js e npm;
- MySQL disponível localmente;
- Git.

O frontend não declara atualmente uma versão mínima de Node.js. O npm declarado pelo projeto é `10.9.2`.

### 1. Banco e variáveis de ambiente

Prepare um banco MySQL local. O backend exige:

- `DB_PASSWORD`: senha do usuário local do banco;
- `JWT_SECRET`: chave de assinatura com pelo menos 32 bytes.

Também é possível personalizar `DB_URL`, `DB_USERNAME` e `JWT_EXPIRATION_MS`. Valores reais de senha, token ou chave JWT não devem ser salvos no Git.

Consulte [burger/README.md](burger/README.md) e o [guia de integração com MySQL](burger/docs/INTEGRATION_BACKEND_MYSQL.md) para a configuração detalhada.

### 2. Backend

```bash
cd burger
bash mvnw spring-boot:run
```

Por padrão, a API fica disponível em `http://localhost:8080`.

### 3. Frontend

Em outro terminal:

```bash
cd PI_
npm install
npm start
```

A aplicação fica disponível em `http://localhost:4200`.

## Testes e validação

Resultados confirmados em 17/08/2026:

| Camada   | Testes                                        | Build                                         |
| -------- | --------------------------------------------- | --------------------------------------------- |
| Frontend | 10 arquivos, 34/34 testes aprovados           | build de produção concluído com sucesso       |
| Backend  | 25/25 testes, 0 falhas, 0 erros e 0 ignorados | `bash mvnw clean package` com `BUILD SUCCESS` |

Comandos:

```bash
# Frontend
cd PI_
npm test -- --watch=false
npm run build

# Backend
cd ../burger
bash mvnw clean package
```

O pacote do backend é gerado em `burger/target/code_ink-0.0.1-SNAPSHOT.jar`.

## Fluxo Full Stack validado

O fluxo abaixo foi validado manualmente pela interface e conferido no banco:

```text
Angular
  → autenticação JWT
  → Spring Boot
  → MySQL
  → relacionamento cliente_id
  → GET /api/agendamentos/meus
  → Angular
```

O teste incluiu cadastro/login de `CLIENTE`, acesso ao perfil, criação de agendamento, status inicial `Pendente` e exibição em “Meus agendamentos”. No MySQL, o `cliente_id` gravado correspondeu ao `usuarios.id` da pessoa autenticada.

O nome enviado pelo navegador não define o proprietário. O backend obtém a identidade a partir da autenticação e consulta os agendamentos pelo ID do usuário.

## Status atual

O Code Ink é um projeto Full Stack em evolução, com os fluxos centrais de autenticação e agendamento integrados entre Angular, Spring Boot e MySQL. Outras áreas permanecem parciais e são apresentadas abaixo como limitações.

## Limitações conhecidas

- catálogos e algumas operações administrativas ainda possuem funcionalidades parciais;
- _authorization hardening_ pendente em `/api/tatuadores/**`; detalhes em [burger/docs/AUTHENTICATION.md](burger/docs/AUTHENTICATION.md);
- rota visual de agendamento pública, embora a criação na API exija autenticação de `CLIENTE`;
- sem recuperação de senha, refresh token ou invalidação de token no servidor;
- sem pagamento, envio de contato ou upload persistente de referências;
- indicadores visuais de tatuagens e avaliações no dashboard ainda demonstrativos;
- sem configuração de produção ou estratégia de deploy documentada.

## Aprendizados demonstrados

- integração entre Angular, API REST e MySQL;
- separação de responsabilidades entre controller, service, repository e interface;
- diferença entre autenticação e autorização, com a fronteira de confiança mantida no servidor;
- ownership de recursos baseado na identidade autenticada;
- relacionamento JPA por chave estrangeira e consultas por ID;
- proteção de senhas com BCrypt e sessão stateless com JWT;
- testes de componentes, serviços, segurança, controllers e repositories;
- evolução incremental com Git, documentação técnica e validação manual Full Stack.

## Documentação

- [Arquitetura do frontend e integração](PI_/docs/ARCHITECTURE.md)
- [Contexto atual do projeto](PI_/docs/PROJECT_CONTEXT.md)
- [Roadmap](PI_/docs/ROADMAP.md)
- [Autenticação e autorização](burger/docs/AUTHENTICATION.md)
- [Integração Spring Boot + MySQL](burger/docs/INTEGRATION_BACKEND_MYSQL.md)
