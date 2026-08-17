# Code Ink — Contexto do projeto

Atualizado em 17/08/2026 com base no frontend Angular e no backend Spring Boot do repositório `Fabrizio-bezerra99/codeink`.

## Visão geral

Code Ink é um projeto acadêmico Full Stack que representa a experiência digital de um estúdio de tatuagem. O mesmo repositório contém o frontend web em Angular e o backend em Spring Boot.

O sistema atual permite explorar um catálogo demonstrativo, autenticar usuários, criar agendamentos persistidos no MySQL, consultar os agendamentos do cliente autenticado e alterar status em uma área administrativa. Catálogo, contato e outras áreas visuais ainda possuem dados ou comportamentos locais.

## Fonte da verdade

Para o estado funcional, a ordem de confiança é:

1. código e configuração atuais;
2. testes executáveis;
3. documentação atualizada;
4. ideias e planos, sempre marcados como TODO.

Não se deve inferir backend, banco, aplicativo mobile ou regras de negócio apenas porque existem models ou services preparados para HTTP.

## Escopo confirmado

### Disponível neste repositório

- aplicação Angular standalone em `PI_/`;
- API Spring Boot em `burger/`;
- TypeScript, HTML5 e CSS3;
- rotas públicas e protegidas;
- componentes compartilhados;
- Reactive Forms;
- signals e estado derivado;
- mocks de catálogo;
- sessão mínima no `sessionStorage`;
- autenticação JWT e senhas com BCrypt;
- usuários e agendamentos persistidos em MySQL;
- relação JPA entre `Agendamento` e `Usuario` por `cliente_id`;
- services HTTP ativos para autenticação e agendamentos;
- testes automatizados no frontend e backend.

### Não encontrado neste repositório

- documentação OpenAPI/Swagger;
- aplicativo Flutter/Dart;
- infraestrutura de deploy;
- pipeline de CI;
- migrations versionadas para produção.

## Objetivos e estado atual

| Objetivo do produto             | Estado confirmado                                     |
| ------------------------------- | ----------------------------------------------------- |
| apresentar o estúdio            | implementado como conteúdo visual demonstrativo       |
| exibir portfólio                | implementado com mock, busca e filtro                 |
| exibir flash tattoos            | implementado com mock e filtro                        |
| apresentar tatuadores           | implementado com mock                                 |
| autenticar usuários             | integrado ao backend com JWT                          |
| cadastrar clientes              | integrado ao backend; cadastro público cria `CLIENTE` |
| solicitar agendamento           | integrado e persistido no MySQL                       |
| gerenciar status de agendamento | integrado à API para `ADMIN`                          |
| mostrar perfil do cliente       | sessão real, `/meus` e alguns valores visuais fixos   |
| enviar contato                  | somente validação e confirmação visual                |
| gerenciar portfólio             | não implementado                                      |
| gerenciar tatuadores            | não implementado                                      |
| gerenciar flash tattoos         | não implementado                                      |
| processar pagamentos            | não implementado; há somente model e service HTTP     |
| integrar API                    | autenticação e agendamentos integrados                |
| persistir em banco              | usuários e agendamentos persistidos em MySQL          |
| oferecer aplicativo mobile      | não implementado nesta raiz                           |

## Usuários demonstrativos

### Perfis

- o backend autentica por email e senha armazenada com BCrypt;
- o cadastro público cria exclusivamente o perfil `CLIENTE`;
- `ADMIN`, `CLIENTE` e `TATUADOR` são definidos pelo backend e retornados no JWT;
- `ADMIN` acessa `/dashboard` e `/dashboard/agendamentos`;
- `CLIENTE` acessa `/perfil` e cria agendamentos autenticados;
- `TATUADOR` possui guard e pode autenticar, mas a área específica ainda não está implementada.

Não há senhas, tokens ou segredos de demonstração versionados. Os identificadores de contas locais fictícias estão documentados sem suas senhas; contas `ADMIN` e `TATUADOR` devem ser provisionadas fora do cadastro público.

## Dados e persistência

### Mocks

`src/app/core/data/catalogo.mock.ts` contém:

- 4 artistas;
- 8 trabalhos de portfólio;
- 10 flash tattoos;
- 4 agendamentos iniciais;
- 2 avaliações.

Os nomes, avaliações, preços, contatos e demais conteúdos devem ser tratados como dados de demonstração.

### Navegador e banco

| Local                | Conteúdo                                              |
| -------------------- | ----------------------------------------------------- |
| `sessionStorage`     | `codeInk.accessToken` e `codeInk.usuario` da sessão   |
| `localStorage`       | chaves legadas de agendamento mantidas no service     |
| MySQL `usuarios`     | identidade, perfil, contato e hash BCrypt             |
| MySQL `agendamentos` | dados do agendamento e chave estrangeira `cliente_id` |

Limpar os dados do site encerra a sessão local, mas não apaga usuários ou agendamentos do MySQL. As páginas ativas de agendamento não usam o `localStorage` como fonte principal.

## Domínio modelado no frontend

Os models de domínio sugerem estas entidades:

- `Usuario`;
- `Cliente`;
- `Tatuador`;
- `Agendamento`;
- `Tatuagem`;
- `Portfolio`;
- `Pagamento`.

Também existem models próprios para a interface, como `ArtistaCatalogo` e `TrabalhoPortfolio`. Eles representam os campos necessários às telas e não são equivalentes diretos aos models de domínio.

As relações presentes nos tipos TypeScript são:

```text
Cliente ----\
             -> Agendamento -> Tatuagem
Tatuador ---/       |
                    -> Pagamento

Tatuador -> Portfolio -> Tatuagem opcional
```

No backend, `Usuario` e `Agendamento` são entidades JPA confirmadas. `Agendamento.cliente` usa `@ManyToOne` e `@JoinColumn(name = "cliente_id")`. As outras entidades e seus controllers não comprovam CRUDs funcionais, pois vários services ainda não estão implementados.

## Tecnologias confirmadas

### Aplicação

- Angular 21;
- TypeScript 5.9;
- RxJS 7.8;
- HTML5;
- CSS3.

### Desenvolvimento e testes

- Angular CLI/build;
- npm;
- Vitest;
- jsdom;
- Prettier;
- Git.

### Backend e banco

- Java 21;
- Spring Boot 4.1;
- Spring Security;
- Spring Data JPA;
- JJWT;
- BCrypt;
- MySQL;
- H2 nos testes.

### Ferramentas configuradas

- extensão Angular recomendada para VS Code;
- tarefas de start e test no VS Code;
- configuração de debug para Chrome;
- MCP do Angular CLI via `npx`.

Figma é citado em `REFATORACAO.md` como origem do protótipo, mas essa origem não pode ser provada apenas pelo código atual.

TODO: manter links ou arquivos de design no repositório de documentação se o grupo desejar preservar essa rastreabilidade.

## Repositório

Remoto confirmado em 17/08/2026:

```text
https://github.com/Fabrizio-bezerra99/codeink.git
```

## Conteúdo institucional

A interface mostra endereço no Rio de Janeiro, telefone, email, horários, redes sociais e afirmações sobre experiência, materiais e higiene. Esses valores existem nos templates e mocks, mas o código não permite confirmar que representem uma organização real.

TODO antes de publicar:

- validar nome, endereço, telefone, email e horário;
- substituir links genéricos de Instagram e YouTube;
- confirmar autorização para textos, nomes e imagens;
- revisar preços e datas demonstrativas;
- definir política de privacidade e tratamento de dados, se o sistema coletar informações reais.

## Arquitetura integrada

Autenticação e agendamentos seguem atualmente este caminho:

```text
Components/Pages
      -> Services
          -> HttpClient + JWT
              -> Spring Boot / Spring Security
                  -> Services e repositories JPA
                      -> MySQL
```

O trust boundary, ou fronteira de confiança, fica no backend. Os guards do Angular orientam a interface, mas somente o Spring Security e as regras dos services podem autorizar uma operação ou definir o proprietário de um registro.

No agendamento, o servidor obtém o email autenticado, resolve `Usuario`, grava `agendamentos.cliente_id` e lista os registros por esse ID. O nome recebido no payload não é usado como prova de identidade.

Para os catálogos e CRUDs ainda incompletos, permanecem como próximos passos:

- corrigir a autorização de escrita em `/api/tatuadores/**`;
- concluir services e regras de negócio antes de conectar novas telas;
- alinhar os services Angular legados às rotas `/api` e aos arquivos de ambiente;
- criar contrato versionado da API;
- adotar migrations antes de um ambiente de produção;
- decidir se o aplicativo Flutter permanece no escopo.

## Limitações atuais relevantes

- o catálogo público permanece local e não comprova um CRUD de tatuadores ou portfólio;
- há uma pendência conhecida de autorização em operações de escrita de `/api/tatuadores/**`;
- diversos controllers chamam services ainda não implementados;
- a rota Angular `/agendamento` é pública, mas a criação no backend requer `CLIENTE` autenticado;
- não há recuperação de senha, refresh token, pagamento ou upload persistente;
- os indicadores de tatuagens e avaliações do dashboard são demonstrativos.

## Requisitos ainda não documentados

Não há um documento formal e aprovado de requisitos funcionais, requisitos não funcionais, casos de uso ou critérios de aceite. Parte das regras já está expressa no código e nos testes, mas ainda precisa ser consolidada como especificação de produto.

TODO com o grupo:

1. formalizar que `CLIENTE` cria e consulta os próprios agendamentos e `ADMIN` gerencia status;
2. definir todas as transições oficiais do agendamento;
3. definir disponibilidade, duração e conflitos de horário;
4. definir regras de preço, sinal, cancelamento e reembolso;
5. definir cadastro e aprovação de tatuadores;
6. definir propriedade e moderação do portfólio;
7. definir favoritos e inspirações;
8. definir dados pessoais necessários e política de retenção;
9. definir canais reais de contato e notificações;
10. definir critérios mínimos de acessibilidade e navegadores suportados.

## Organização da equipe

A composição e a divisão atual de responsabilidades não podem ser confirmadas pelo código.

TODO: registrar responsáveis atuais por frontend, backend, banco, mobile, design, testes e documentação somente após confirmação do grupo.

## Documentos relacionados

- `../README.md`: entrada do frontend e execução;
- `../../README.md`: visão Full Stack do repositório;
- `docs/ARCHITECTURE.md`: estrutura e fluxos técnicos;
- `docs/CODEBASE_ANALYSIS.md`: auditoria histórica de 29/07/2026;
- `docs/ROADMAP.md`: prioridades futuras;
- `docs/LEARNING_LOG.md`: histórico das sessões;
- `REFATORACAO.md`: histórico do protótipo visual.
