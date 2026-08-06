# Code Ink

Frontend acadêmico para apresentação e gerenciamento demonstrativo de um estúdio de tatuagem. O repositório contém uma aplicação Angular standalone; o backend Spring Boot fica no repositório separado `burger`.

> Estado atual: o login, cadastro e restauração de sessão usam a API Spring Boot real. O token e o usuário mínimo ficam em `sessionStorage`; o catálogo continua com dados mockados e o agendamento mantém o fluxo visual existente.

## Funcionalidades implementadas

- Home, portfólio com busca e filtro, detalhes de trabalho e catálogo de flash tattoos.
- Lista e perfil de tatuadores com dados mockados.
- Login, cadastro e logout local integrados a `/api/auth` com JWT.
- Perfil do cliente protegido por guard de rota.
- Fluxo demonstrativo de agendamento em quatro etapas.
- Persistência local dos agendamentos criados e de mudanças de status.
- Dashboard e gestão de agendamentos protegidos para o perfil administrador.
- Formulário de contato validado, com confirmação apenas visual.
- Layout responsivo, componentes reutilizáveis e rotas carregadas sob demanda.

## Limites da demonstração

- Não há envio de contato, pagamento ou recuperação de senha.
- A autorização real é aplicada pelo backend; os guards Angular melhoram a navegação, mas não substituem a validação do token no servidor.
- Favoritos, inspirações, recuperação de senha, edição de perfil e configurações aparecem na interface, mas não possuem fluxo funcional completo.
- Os links de “gerenciar” portfólio, tatuadores e flash tattoos levam às páginas públicas; não há CRUD administrativo dessas áreas.
- A escolha “portfólio” no agendamento registra apenas o tipo de projeto; não existe seleção de um trabalho específico nem upload de referência.
- As imagens do catálogo são carregadas do Unsplash e dependem de conexão com a internet. A imagem principal do estúdio é local.

## Tecnologias

| Tecnologia   | Declaração no projeto               |
| ------------ | ----------------------------------- |
| Angular      | `^21.2.0`                           |
| TypeScript   | `~5.9.2`                            |
| RxJS         | `~7.8.0`                            |
| Vitest       | `^4.0.8`                            |
| HTML5 e CSS3 | templates e estilos dos componentes |
| npm          | `10.9.2` no campo `packageManager`  |

As versões acima são as faixas declaradas em `package.json`; o `package-lock.json` determina as versões efetivamente instaladas.

## Como executar

### Pré-requisitos

- Node.js e npm instalados.

TODO: definir e registrar uma versão mínima de Node.js. O repositório não possui campo `engines`, `.nvmrc` ou arquivo equivalente que permita confirmá-la.

### Instalação e desenvolvimento

```bash
npm install
npm start
```

Acesse `http://localhost:4200`.

No Windows PowerShell, caso a política de execução bloqueie `npm.ps1`, use os equivalentes `npm.cmd install` e `npm.cmd start`.

### Build e testes

```bash
npm run build
npm test -- --watch=false
```

Validações mais recentes realizadas em 30/07/2026:

- build de produção concluído;
- verificação do compilador Angular com `ngc --noEmit` concluída;
- 5 arquivos de teste e 16 testes aprovados.

Os testes atuais cobrem a criação do componente raiz, a navbar, as regras locais do `AgendamentoService`, os controles de senha e a sincronização do preenchimento automático no cadastro. Ainda não validam os fluxos completos de autenticação, filtros, guards ou a integração entre agendamento, perfil e administração.

## Autenticação

O cadastro público cria somente clientes por `POST /api/auth/cadastro`. O login usa `POST /api/auth/login`, e a restauração consulta `GET /api/auth/me`. A chave `JWT_SECRET` é configurada somente no ambiente do backend; não há credenciais de demonstração versionadas.

O token e o usuário mínimo da sessão usam `sessionStorage`. Os agendamentos ainda mantêm as chaves locais existentes para compatibilidade com o fluxo visual do MVP.

## Organização

```text
src/app/
  core/
    data/       # mocks do catálogo e agendamentos iniciais
    guards/     # autorização de rotas por perfil
    services/   # estado local e scaffolding HTTP
  models/       # models de domínio e interfaces da camada visual
  pages/        # componentes de página carregados pelas rotas
  shared/       # layout, navegação, rodapé, cabeçalhos e cards
```

Fluxo atual de dados:

```text
Pages/Components -> Services -> mocks e estado local de agendamentos
                              -> HttpClient -> API Spring Boot real
```

## Documentação

- [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md): objetivo e limites confirmados do projeto.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): arquitetura e fluxos atuais.
- [`docs/CODEBASE_ANALYSIS.md`](docs/CODEBASE_ANALYSIS.md): auditoria técnica e inconsistências.
- [`docs/ROADMAP.md`](docs/ROADMAP.md): próximos passos documentais e técnicos.
- [`docs/LEARNING_LOG.md`](docs/LEARNING_LOG.md): histórico de aprendizado.
- [`REFATORACAO.md`](REFATORACAO.md): registro da migração do protótipo visual.

## API integrada

Há services tipados apontando para `http://localhost:8080`, e o `AuthService`, o interceptor e o fluxo de agendamento usam `HttpClient`. O contrato de autenticação está implementado no backend `burger`; a URL de produção ainda precisa ser definida.
