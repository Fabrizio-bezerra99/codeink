# Code Ink — Contexto do projeto

Atualizado em 27/07/2026 com base no estado atual do repositório.

## Visão geral

Code Ink é um projeto acadêmico que representa a experiência digital de um estúdio de tatuagem. O código disponível implementa somente o frontend web em Angular.

O sistema atual permite explorar um catálogo demonstrativo, simular autenticação, criar um resumo local de agendamento e alterar seu status em uma área administrativa. Os dados não são enviados a um servidor.

## Fonte da verdade

Para o estado funcional, a ordem de confiança é:

1. código e configuração atuais;
2. testes executáveis;
3. documentação atualizada;
4. ideias e planos, sempre marcados como TODO.

Não se deve inferir backend, banco, aplicativo mobile ou regras de negócio apenas porque existem models ou services preparados para HTTP.

## Escopo confirmado

### Disponível neste repositório

- aplicação Angular standalone;
- TypeScript, HTML5 e CSS3;
- rotas públicas e protegidas;
- componentes compartilhados;
- Reactive Forms;
- signals e estado derivado;
- mocks de catálogo;
- sessão e agendamentos no `localStorage`;
- services HTTP tipados para uma API futura;
- dois testes básicos de componentes.

### Não encontrado neste repositório

- backend Java/Spring Boot;
- banco de dados ou scripts SQL;
- migrations;
- documentação OpenAPI/Swagger;
- aplicativo Flutter/Dart;
- infraestrutura de deploy;
- pipeline de CI;
- autenticação real ou emissão de token.

## Objetivos e estado atual

| Objetivo do produto             | Estado confirmado                                     |
| ------------------------------- | ----------------------------------------------------- |
| apresentar o estúdio            | implementado como conteúdo visual demonstrativo       |
| exibir portfólio                | implementado com mock, busca e filtro                 |
| exibir flash tattoos            | implementado com mock e filtro                        |
| apresentar tatuadores           | implementado com mock                                 |
| autenticar usuários             | simulado no navegador                                 |
| cadastrar clientes              | simulado; apenas nome e email chegam ao service local |
| solicitar agendamento           | simulado e persistido no navegador                    |
| gerenciar status de agendamento | implementado localmente para administrador            |
| mostrar perfil do cliente       | implementado com sessão, mocks e valores fixos        |
| enviar contato                  | somente validação e confirmação visual                |
| gerenciar portfólio             | não implementado                                      |
| gerenciar tatuadores            | não implementado                                      |
| gerenciar flash tattoos         | não implementado                                      |
| processar pagamentos            | não implementado; há somente model e service HTTP     |
| integrar API                    | não implementado nas páginas                          |
| persistir em banco              | não implementado nesta raiz                           |
| oferecer aplicativo mobile      | não implementado nesta raiz                           |

## Usuários demonstrativos

### Perfis

- o backend autentica por email e senha armazenada com BCrypt;
- o cadastro público cria exclusivamente o perfil `CLIENTE`;
- `ADMIN`, `CLIENTE` e `TATUADOR` são definidos pelo backend e retornados no JWT;
- `ADMIN` acessa `/dashboard` e `/dashboard/agendamentos`;
- `CLIENTE` acessa `/perfil` e cria agendamentos autenticados;
- `TATUADOR` possui guard e pode autenticar, mas a área específica ainda não está implementada.

Não há credenciais de demonstração versionadas. Contas `ADMIN` e `TATUADOR` devem ser provisionadas fora do cadastro público.

## Dados e persistência

### Mocks

`src/app/core/data/catalogo.mock.ts` contém:

- 4 artistas;
- 8 trabalhos de portfólio;
- 10 flash tattoos;
- 4 agendamentos iniciais;
- 2 avaliações.

Os nomes, avaliações, preços, contatos e demais conteúdos devem ser tratados como dados de demonstração.

### Armazenamento do navegador

| Chave                       | Conteúdo                                                 |
| --------------------------- | -------------------------------------------------------- |
| `codeInk.accessToken`       | token JWT da sessão atual                                |
| `codeInk.usuario`           | usuário mínimo da sessão atual                           |
| `codeInk.agendamentos`      | lista de agendamentos criados ou sobrescritos localmente |
| `codeInk.ultimoAgendamento` | resumo legado mantido por compatibilidade                |

Limpar os dados do site no navegador remove essa persistência. Não existe sincronização entre dispositivos ou usuários.

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

Esses tipos não comprovam tabelas, chaves estrangeiras ou entidades de backend.

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

### Ferramentas configuradas

- extensão Angular recomendada para VS Code;
- tarefas de start e test no VS Code;
- configuração de debug para Chrome;
- MCP do Angular CLI via `npx`.

Figma é citado em `REFATORACAO.md` como origem do protótipo, mas essa origem não pode ser provada apenas pelo código atual.

TODO: manter links ou arquivos de design no repositório de documentação se o grupo desejar preservar essa rastreabilidade.

## Repositório

Remoto confirmado em 27/07/2026:

```text
https://github.com/Fabrizio-bezerra99/ProjetoIntegradorGrupo.git
```

O identificador antigo `Fabrizio-bezerra99/PI-code-ink` não corresponde ao remoto atual.

## Conteúdo institucional

A interface mostra endereço no Rio de Janeiro, telefone, email, horários, redes sociais e afirmações sobre experiência, materiais e higiene. Esses valores existem nos templates e mocks, mas o código não permite confirmar que representem uma organização real.

TODO antes de publicar:

- validar nome, endereço, telefone, email e horário;
- substituir links genéricos de Instagram e YouTube;
- confirmar autorização para textos, nomes e imagens;
- revisar preços e datas demonstrativas;
- definir política de privacidade e tratamento de dados, se o sistema coletar informações reais.

## Arquitetura pretendida para integração

O código sugere uma futura comunicação HTTP:

```text
Components/Pages
      -> Services
          -> HttpClient
              -> API em localhost:8080
```

O backend e o banco não estão disponíveis nesta raiz. Portanto, a arquitetura abaixo é somente um TODO de integração, não uma descrição de algo existente:

```text
Frontend Angular
      -> API REST a confirmar
          -> regras de negócio a confirmar
              -> persistência a confirmar
```

TODO:

- localizar ou criar o repositório oficial do backend;
- confirmar stack, banco e arquitetura em camadas pelo código do backend;
- definir DTOs, endpoints e códigos HTTP;
- definir autenticação e autorização;
- documentar CORS e ambientes;
- criar contrato versionado da API;
- decidir se o aplicativo Flutter permanece no escopo.

## Requisitos ainda não documentados

Não há documentação aprovada de requisitos funcionais, requisitos não funcionais, regras de negócio, casos de uso ou critérios de aceite.

TODO com o grupo:

1. definir quem pode criar e alterar agendamentos;
2. definir estados e transições oficiais do agendamento;
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

- `README.md`: entrada rápida e execução;
- `docs/ARCHITECTURE.md`: estrutura e fluxos técnicos;
- `docs/CODEBASE_ANALYSIS.md`: auditoria, inconsistências e arquivos candidatos;
- `docs/ROADMAP.md`: prioridades futuras;
- `docs/LEARNING_LOG.md`: histórico das sessões;
- `REFATORACAO.md`: histórico do protótipo visual.
