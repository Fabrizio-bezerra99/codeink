# Auditoria da codebase e da documentação — Code Ink

Data da auditoria: 29/07/2026

## Objetivo e método

Esta auditoria compara a documentação com o estado atual do repositório. Foram inspecionados arquivos de configuração, código TypeScript, templates HTML, estilos CSS, models, services, guards, mocks, testes, assets e histórico Git recente.

Nenhum arquivo de código-fonte foi alterado. As únicas mudanças produzidas pela auditoria estão nos documentos do projeto.

Validações executadas:

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
.\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit
```

Resultados:

- build de produção: aprovado;
- compilação Angular sem emissão: aprovada;
- testes: 5 arquivos e 14 testes aprovados;
- Git antes das edições documentais: branch `main` sincronizada com `origin/main`, sem alterações locais;
- remoto confirmado: `Fabrizio-bezerra99/ProjetoIntegradorGrupo.git`.

Os comandos de build e teste precisaram ser executados fora do sandbox da auditoria porque o projeto está no OneDrive e o sandbox não conseguia resolver os arquivos de estilo. A mesma execução, com acesso normal ao diretório, foi concluída com sucesso.

## Resumo executivo

O Code Ink é hoje um frontend Angular 21 standalone, compilável e visualmente estruturado. As páginas públicas usam dados mockados; autenticação e agendamentos são demonstrações persistidas no navegador. Há scaffolding de CRUD HTTP para uma API em `localhost:8080`, mas nenhum backend foi encontrado neste repositório e nenhuma página atual consome esses CRUDs.

A documentação anterior tinha boa intenção didática, porém misturava três tempos diferentes:

1. funcionalidades que existem atualmente;
2. problemas registrados em 17/07/2026 que já foram corrigidos;
3. backend, banco e mobile desejados, mas não confirmados no código.

Também estavam vazios `docs/ARCHITECTURE.md` e `docs/ROADMAP.md`, e o README não explicava os principais limites da demonstração.

## Inventário técnico

| Categoria                  | Quantidade | Observação                                            |
| -------------------------- | ---------: | ----------------------------------------------------- |
| aplicação Angular          |          1 | frontend standalone                                   |
| páginas                    |         14 | incluindo 404 e gestão administrativa de agendamentos |
| componentes compartilhados |          6 | layout, navbar, footer, header e dois cards           |
| services                   |         10 | 3 usados pelas páginas, 6 CRUDs HTTP e 1 vazio        |
| guards                     |          4 | 2 em uso e 2 sem rota                                 |
| arquivos de model          |          9 | domínio, tela e uma classe vazia                      |
| arquivo de mocks           |          1 | artistas, trabalhos, flash, avaliações e agendamentos |
| testes automatizados       |          5 | componentes, regras locais de agendamento e controles de senha |
| assets locais              |          2 | favicon e imagem principal do estúdio                 |

### Tecnologias declaradas

| Tecnologia        | Versão em `package.json` |
| ----------------- | -----------------------: |
| Angular           |                `^21.2.0` |
| Angular CLI/build |                `^21.2.8` |
| TypeScript        |                 `~5.9.2` |
| RxJS              |                 `~7.8.0` |
| Vitest            |                 `^4.0.8` |
| jsdom             |                `^28.0.0` |
| Prettier          |                 `^3.8.1` |

O projeto declara npm `10.9.2` em `packageManager`, mas não declara versão mínima de Node.js.

## Estrutura atual

```text
ProjetoIntegrador/
  .github/                 # instruções para Copilot
  .vscode/                 # tarefas, launch e MCP do Angular CLI
  docs/                    # contexto, arquitetura, auditoria, roadmap e learning log
  prompts/                 # prompts reutilizáveis do fluxo de aprendizagem
  public/                  # favicon e hero local
  src/
    app/
      core/
        data/              # mocks
        guards/            # autorização de rotas
        services/          # dados locais e scaffolding HTTP
      interceptors/        # interceptor ainda inativo
      models/              # domínio e formatos de tela
      pages/               # páginas carregadas por rota
      shared/              # componentes reutilizáveis
    index.html
    main.ts
    styles.css
```

## Estado funcional confirmado

### Implementado e operacional no frontend

- inicialização Angular standalone;
- `HttpClient` e router registrados;
- lazy loading das páginas;
- layout público com navbar responsiva e footer;
- home com conteúdo e trabalhos recentes;
- portfólio com filtro por estilo, busca e estado vazio;
- detalhe de trabalho com navegação anterior/próximo;
- flash tattoos com filtro por tamanho e preço formatado;
- lista e perfil de tatuadores;
- login e cadastro simulados com validação;
- sessão persistida em `localStorage`;
- guards de cliente e administrador;
- redirecionamento de volta à rota solicitada após o login;
- agendamento em quatro etapas;
- gravação local de novos agendamentos;
- dashboard com resumo da lista de agendamentos;
- página administrativa para confirmar ou cancelar agendamentos;
- perfil do cliente com agendamentos filtrados pelo nome da sessão;
- contato com validação e confirmação visual;
- página 404;
- media queries e estilos isolados por componente;
- atributos semânticos e ARIA pontuais.

### Implementado como integração real ou simulação local

| Área                  | Comportamento real do código                          |
| --------------------- | ----------------------------------------------------- |
| autenticação          | login real via JWT e perfis definidos pelo backend    |
| cadastro              | cria cliente no backend por `/api/auth/cadastro`      |
| sessão                | persiste token e usuário mínimo em `sessionStorage`    |
| catálogo              | lê arrays de `catalogo.mock.ts`                       |
| agendamento           | salva resumo em `codeInk.agendamentos`                |
| atualização de status | sobrescreve localmente mocks ou registros criados     |
| contato               | exibe sucesso e reseta o formulário                   |
| favorito no detalhe   | dura somente enquanto o componente permanece ativo    |
| favoritos no perfil   | mostra sempre os cinco primeiros trabalhos do mock    |
| indicadores           | parte calculada e parte fixa no componente            |

### Preparado, mas não integrado

- CRUD HTTP de usuários;
- CRUD HTTP de clientes;
- CRUD HTTP de tatuadores;
- CRUD HTTP de tatuagens;
- CRUD HTTP de portfólios;
- CRUD HTTP de pagamentos;
- CRUD HTTP de agendamentos;
- interceptor de autenticação JWT;
- model e service administrativos.

Os CRUDs ainda são scaffolding e não devem ser apresentados como API funcional. A autenticação e o cadastro são exceções integradas ao backend; o agendamento mantém partes locais e partes HTTP conforme o fluxo do MVP.

## Mapa de páginas

| Página                        | Responsabilidade atual                          | Observação importante                            |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `HomeComponente`              | apresentação, diferenciais e trabalhos recentes | textos institucionais são conteúdo demonstrativo |
| `PortfolioComponente`         | busca e filtro locais                           | dados do mock                                    |
| `TattooDetailComponente`      | detalhes e navegação entre trabalhos            | ID inválido cai no primeiro trabalho             |
| `FlashTattoosComponente`      | filtro de flash por tamanho                     | dados e preços do mock                           |
| `TatuadoresComponente`        | catálogo de artistas                            | dados do mock                                    |
| `TatuadorPerfilComponente`    | perfil, trabalhos e avaliações                  | ID inválido cai no primeiro artista              |
| `AgendamentoComponente`       | fluxo local em quatro etapas                    | rota pública, sem disponibilidade real           |
| `ContatoComponente`           | formulário reativo                              | sem envio externo                                |
| `LoginComponente`             | login via API e JWT                             | perfil vem do backend                            |
| `CadastroComponente`          | cadastro via API                                | redireciona para login após sucesso              |
| `ClientePerfilComponente`     | resumo local do cliente                         | vários dados e botões são estáticos              |
| `DashboardComponente`         | visão administrativa                            | tatuagens e avaliações são indicadores fixos     |
| `AgendamentosAdminComponente` | gestão local de status                          | sem API e sem histórico de alterações            |
| `NotFoundComponente`          | erro 404                                        | usada somente pelo wildcard                      |

## Fluxos importantes

### Login

1. O formulário valida email e senha.
2. O `AuthService` chama `POST /api/auth/login`.
3. O token e o usuário mínimo ficam em `sessionStorage`.
4. A sessão é revalidada por `GET /api/auth/me`.
5. A página navega para o parâmetro `redirect`, para `/dashboard`, `/tatuadores` ou `/perfil`.

O checkbox “Lembrar de mim” não é consultado; a sessão sempre é persistida.

### Cadastro

1. Nome, email, telefone, senha e confirmação são validados no componente.
2. Os quatro campos de cadastro são enviados a `POST /api/auth/cadastro`.
3. O backend cria exclusivamente um cliente e não retorna senha.
4. A página redireciona para `/login`.

Não há verificação de email duplicado, aceite de termos, persistência de telefone ou criação de conta em servidor.

### Agendamento

1. O usuário escolhe tipo de projeto, tatuador, data e horário.
2. Ao confirmar, o componente chama `AgendamentoService.cadastrarResumo()`.
3. O registro recebe um ID local e status `Pendente`.
4. A lista é salva em `codeInk.agendamentos`.
5. O resumo legado também é salvo em `codeInk.ultimoAgendamento`.
6. Dashboard, perfil e gestão administrativa leem a lista combinada com os mocks.

A implementação também migra um resumo da chave antiga se ainda não houver uma lista nova.

### Gestão de status

- pendente: pode ser confirmado ou cancelado;
- confirmado: pode ser cancelado;
- cancelado: não pode ser alterado pela interface;
- finalizado: não pode ser alterado pela interface.

## Inconsistências de documentação encontradas

### Informações desatualizadas

1. `docs/CODEBASE_ANALYSIS.md` afirmava que `TatuadorPerfilComponente` não compilava. O componente agora usa `CatalogoService` e compila.
2. O mesmo documento afirmava que `TatuadoresComponente` tratava `artistas` como signal incorretamente. Hoje `artistas` é um array e o template está coerente.
3. A análise antiga dizia que `provideHttpClient()` não estava configurado. Ele está registrado em `app.config.ts`.
4. A análise antiga não incluía `/dashboard/agendamentos`, persistência da lista local ou gestão de status.
5. `PROJECT_CONTEXT.md` citava o repositório `Fabrizio-bezerra99/PI-code-ink`; o remoto atual é `Fabrizio-bezerra99/ProjetoIntegradorGrupo.git`.
6. Próximos passos antigos do Learning Log já tinham sido realizados em sessões posteriores. As entradas foram preservadas como histórico, não como roadmap atual.

### Afirmações amplas ou incorretas

1. O README não separava claramente “services preparados” de integração operacional com API.
2. “Dados de agendamento são mocks” era incompleto: a aplicação combina mocks, `localStorage` novo e uma chave legada.
3. “Melhorias de acessibilidade” não pode ser interpretado como conformidade WCAG. Não há teste AXE ou auditoria equivalente no repositório.
4. Os textos de contato, endereço, redes sociais, higiene e experiência dos artistas são conteúdo da demonstração; o código não comprova dados de um estúdio real.
5. A arquitetura de backend, banco e Flutter em `PROJECT_CONTEXT.md` era intenção futura, não estado do repositório.

### Funcionalidades que não estavam documentadas

- rota administrativa `/dashboard/agendamentos`;
- regras de alteração de status;
- `codeInk.agendamentos` e compatibilidade com `codeInk.ultimoAgendamento`;
- exibição no perfil dos agendamentos associados ao nome do usuário;
- fallback para o primeiro catálogo quando um ID não existe;
- dependência de imagens externas do Unsplash;
- comportamento sem efeito do checkbox “Lembrar de mim”;
- aceitação de qualquer email válido com a senha de demonstração;
- diferença entre favoritos temporários e a lista fixa do perfil;
- indicadores parcialmente calculados e parcialmente fixos.

### Documentos vazios

- `docs/ARCHITECTURE.md`;
- `docs/ROADMAP.md`.

Ambos foram preenchidos nesta auditoria.

## Problemas e lacunas confirmados no código

Estes pontos foram documentados, mas não corrigidos por causa do escopo somente documental.

### Alta prioridade

1. **Autenticação é apenas uma demonstração.** Guards no navegador não são segurança; qualquer pessoa pode manipular o armazenamento local.
2. **A interface mistura ações reais e aparentes.** Recuperar senha, editar informações, inspirações, configurações e gestão de três catálogos não possuem implementação.
3. **Não há contrato de API.** Services assumem URLs, formatos e endpoints sem evidência de backend nesta raiz.
4. **Cobertura de testes insuficiente.** O `AgendamentoService` possui testes automatizados, mas a maior parte dos fluxos centrais ainda não está coberta.
5. **Dados institucionais não confirmados.** Telefone, email, endereço, redes sociais e afirmações do estúdio devem ser validados antes de publicação.

### Média prioridade

1. `CatalogoService.listar()` existe, não é usado e lança erro.
2. `AdminService` e `Admin` estão vazios.
3. `authGuardGuard`, `tatuadorGuard` e o interceptor não são usados.
4. `PortifolioService` e `portifolio.ts` usam grafia diferente de `portfolio` nas páginas e no model `Portfolio`.
5. O nome `authInterceptorInterceptor` é redundante.
6. URLs de API estão duplicadas e fixas em `localhost:8080`.
7. Componentes usam `CatalogoService`, enquanto os services de domínio HTTP permanecem isolados; ainda não há camada de mapeamento.
8. IDs inválidos em detalhes não produzem 404, o que pode esconder links incorretos.
9. Agendamento público pode ser salvo como cliente genérico e depois não aparece no perfil autenticado.
10. Não há validação de disponibilidade, conflito de horário ou data por parte de um servidor.

### Baixa prioridade

1. CSS de login e cadastro repete grande parte das mesmas regras.
2. Formatação e estilo de injeção de dependência variam entre services/componentes.
3. Links sociais apontam para páginas genéricas de Instagram e YouTube.
4. Não há licença, guia de contribuição ou política de versionamento documentados.
5. O ano do footer é calculado no cliente; é correto para o uso atual, mas não possui teste.

## Redundâncias

### Documentação

- `README.md`, `REFATORACAO.md` e a antiga análise repetiam a descrição da organização Angular. A nova organização mantém o README curto, a arquitetura detalhada e a refatoração como histórico.
- `AGENTS.md` e `.github/copilot-instructions.md` repetem algumas boas práticas, mas atendem ferramentas diferentes; não são considerados duplicados removíveis automaticamente.
- O Learning Log repete resultados de testes por sessão. Isso é aceitável como diário histórico; o estado atual deve ser consultado no README e nesta auditoria.

### Código identificado, mas não alterado

- estilos de autenticação duplicados em login e cadastro;
- sete services com o mesmo padrão CRUD;
- modelos de domínio separados dos models de catálogo sem mapeadores entre eles.

## Arquivos candidatos a remoção ou revisão

Nenhum arquivo foi removido. Os candidatos abaixo exigem confirmação do grupo.

| Arquivo                                                | Evidência                                                                             | Recomendação                                                                                      |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `GitFacil.exe`                                         | binário de aproximadamente 8 MB, sem metadados de produto e sem referência no projeto | confirmar origem e necessidade; preferir ferramenta externa ou release, não binário versionado    |
| `src/app/models/admin.ts`                              | classe vazia e sem import                                                             | remover quando confirmado que não faz parte de um contrato futuro                                 |
| `src/app/core/services/admin-service.ts`               | service vazio e sem consumidor                                                        | remover ou implementar somente após requisito confirmado                                          |
| `src/app/core/guards/auth-guard-guard.ts`              | guard sem rota                                                                        | decidir se substituirá guards específicos ou se deve ser removido                                 |
| `src/app/core/guards/tatuador-guard.ts`                | guard sem rota e sem área de tatuador                                                 | manter apenas se a funcionalidade entrar no roadmap                                               |
| `src/app/interceptors/auth-interceptor-interceptor.ts` | pass-through, não registrado                                                          | remover até existir estratégia de autenticação ou implementar depois do contrato                  |
| `REFATORACAO.md`                                       | histórico útil, mas parcialmente sobreposto                                           | manter como registro histórico; futuramente mover para `docs/history/` se surgirem mais registros |

Os services HTTP e models de domínio também não são usados pelas páginas, mas formam um scaffolding coerente de integração. Não devem ser excluídos sem confirmar o plano do backend.

## Qualidade e acessibilidade

Pontos positivos observados:

- HTML semântico em várias páginas;
- `scope` em cabeçalhos de tabela;
- labels de formulário;
- estados de foco globais;
- `aria-label`, `aria-expanded`, `aria-pressed` e regiões nomeadas em pontos relevantes;
- texto alternativo nas imagens;
- `loading="lazy"` em várias imagens de catálogo;
- layout adaptativo com breakpoints.

Limites observados:

- não há teste automatizado de acessibilidade;
- mensagens de validação não são detalhadas por campo;
- mudança de etapa, confirmação e abertura do menu não possuem gestão explícita de foco;
- o botão de mostrar senha do cadastro não tem label ARIA equivalente ao do login;
- indicadores baseados apenas em cor precisam de verificação visual e por leitor de tela;
- responsividade foi inferida do CSS e do build, não validada em uma matriz real de navegadores/dispositivos nesta auditoria.

## Testes existentes e ausentes

### Existentes

- `App` é criado e contém `router-outlet`;
- `NavbarComponent` é criado;
- `AgendamentoService` cobre listagem, cadastro, persistência, atualização de status, deduplicação, chave legada e JSON inválido.
- `LoginComponente` cobre a alternância da senha e seus atributos acessíveis;
- `CadastroComponente` cobre a alternância da senha e seus atributos acessíveis.

### TODO de testes

- `AuthService` e persistência da sessão;
- guards e preservação do redirect;
- validações de login, cadastro e contato;
- busca e filtros;
- rotas de detalhe com ID válido e inválido;
- integração entre agendamento, perfil, dashboard e gestão;
- acessibilidade básica;
- comportamento responsivo crítico.

## Avaliação para portfólio

| Critério                    | Nota | Justificativa resumida                                                      |
| --------------------------- | ---: | --------------------------------------------------------------------------- |
| Organização                 | 7/10 | estrutura Angular clara; scaffolding e nomes ainda inconsistentes           |
| Legibilidade                | 7/10 | componentes pequenos e tipados; há formatação desigual e placeholders       |
| Boas práticas               | 6/10 | standalone, OnPush, signals e forms; segurança e integração ainda simuladas |
| Documentação após auditoria | 8/10 | estado, arquitetura, limites e roadmap agora estão separados                |
| Testes                      | 4/10 | 14 testes cobrem componentes, regras locais de agendamento e controles de senha; fluxos principais ainda não estão cobertos |
| Valor para portfólio        | 6/10 | frontend apresentável e explicável; falta integração real e maior cobertura |

Para uma entrevista júnior, a descrição correta é: “Construímos um frontend Angular standalone com catálogo mockado, autenticação e agendamento simulados no navegador, estrutura preparada para uma futura API e documentação explícita das limitações.” Não é correto afirmar que o sistema Full Stack está concluído.

## Próximos passos documentais

1. Confirmar o repositório e o estado real do backend.
2. Documentar requisitos funcionais e regras de negócio aprovados pelo grupo.
3. Definir contrato de API e exemplos de payload antes da integração.
4. Registrar a versão mínima de Node.js suportada.
5. Validar dados institucionais e direitos de uso das imagens.
6. Criar uma matriz de testes e acessibilidade.
7. Decidir, com o grupo, o destino dos arquivos candidatos a remoção.

Os itens ainda não confirmados estão também marcados como TODO em `PROJECT_CONTEXT.md`, `ARCHITECTURE.md` e `ROADMAP.md`.
