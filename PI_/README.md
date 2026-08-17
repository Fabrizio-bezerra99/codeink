# Code Ink

Frontend Angular do Code Ink, uma aplicação acadêmica Full Stack para apresentação e gerenciamento de um estúdio de tatuagem. O backend Spring Boot está na pasta irmã [`../burger`](../burger) do mesmo repositório.

> Estado atual: login, cadastro, restauração de sessão e o fluxo principal de agendamentos usam a API Spring Boot real. O token e o usuário mínimo ficam em `sessionStorage`; as páginas públicas de catálogo continuam usando dados locais.

## Funcionalidades implementadas

- Home, portfólio com busca e filtro, detalhes de trabalho e catálogo de flash tattoos.
- Lista e perfil de tatuadores com dados mockados.
- Login e cadastro integrados a `/api/auth`, logout local e sessão com JWT.
- Perfil do cliente protegido por guard de rota.
- Fluxo de agendamento em etapas com seleção de trabalho do portfólio ou referência.
- Criação e consulta de agendamentos reais associados ao cliente autenticado.
- Dashboard e gestão de status via API protegidos para o perfil administrador.
- Formulário de contato validado, com confirmação apenas visual.
- Layout responsivo, componentes reutilizáveis e rotas carregadas sob demanda.

## Limites da demonstração

- Não há envio de contato, pagamento ou recuperação de senha.
- A autorização real é aplicada pelo backend; os guards Angular melhoram a navegação, mas não substituem a validação do token no servidor.
- A rota visual `/agendamento` é pública, mas a API aceita a criação somente para um `CLIENTE` autenticado.
- Favoritos, inspirações, recuperação de senha, edição de perfil e configurações aparecem na interface, mas não possuem fluxo funcional completo.
- Os links de “gerenciar” portfólio, tatuadores e flash tattoos levam às páginas públicas; não há CRUD administrativo dessas áreas.
- O agendamento permite selecionar um trabalho ou visualizar uma referência local, mas o arquivo de referência não é enviado nem persistido no backend.
- Parte das imagens do catálogo, especialmente as relacionadas aos artistas, é carregada do Unsplash e depende de conexão. A imagem principal e os trabalhos do portfólio são assets locais.

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

Validações mais recentes confirmadas em 17/08/2026:

- build de produção concluído com sucesso;
- 10 arquivos de teste aprovados;
- 34/34 testes aprovados.

Os testes atuais cobrem o shell e a navbar, autenticação, guards por perfil, interceptor JWT, chamadas HTTP de agendamento, regras locais legadas, seleção do projeto, controles de senha, preenchimento automático no cadastro e atualização administrativa de status. O fluxo completo Angular → API → MySQL foi validado manualmente, não por um único teste automatizado end-to-end.

## Autenticação

O cadastro público cria somente clientes por `POST /api/auth/cadastro`. O login usa `POST /api/auth/login`, e a restauração consulta `GET /api/auth/me`. A chave `JWT_SECRET` é configurada somente no ambiente do backend; não há credenciais de demonstração versionadas.

O token e o usuário mínimo da sessão usam `sessionStorage`. O interceptor adiciona o Bearer token às chamadas protegidas da API e trata respostas `401`. A sessão é restaurada consultando o backend, que permanece como fonte de autoridade.

Na criação de um agendamento, o backend ignora o nome do cliente recebido como fonte de ownership, obtém o usuário pelo JWT e grava a relação por `cliente_id`. A página de perfil consulta `GET /api/agendamentos/meus`, cuja busca é baseada no ID do usuário autenticado.

## Organização

```text
src/app/
  core/
    data/       # dados demonstrativos do catálogo e estruturas legadas
    guards/     # autorização de rotas por perfil
    services/   # estado local e scaffolding HTTP
  models/       # models de domínio e interfaces da camada visual
  pages/        # componentes de página carregados pelas rotas
  shared/       # layout, navegação, rodapé, cabeçalhos e cards
```

Fluxos atuais de dados:

```text
Pages/Components -> CatalogoService -> dados locais do catálogo
                 -> AuthService/AgendamentoService
                    -> HttpClient + JWT
                       -> Spring Boot -> JPA -> MySQL
```

## Documentação

- [`docs/PROJECT_CONTEXT.md`](docs/PROJECT_CONTEXT.md): objetivo e limites confirmados do projeto.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): arquitetura e fluxos atuais.
- [`docs/CODEBASE_ANALYSIS.md`](docs/CODEBASE_ANALYSIS.md): auditoria histórica de 29/07/2026.
- [`docs/ROADMAP.md`](docs/ROADMAP.md): próximos passos documentais e técnicos.
- [`docs/LEARNING_LOG.md`](docs/LEARNING_LOG.md): histórico de aprendizado.
- [`REFATORACAO.md`](REFATORACAO.md): registro histórico da migração do protótipo visual.

## API integrada

O `AuthService`, o interceptor e as telas ativas de agendamento usam `HttpClient` com a URL configurada nos arquivos de ambiente. Em desenvolvimento, a API fica em `http://localhost:8080`.

Fluxos integrados atualmente:

- `POST /api/auth/cadastro`;
- `POST /api/auth/login`;
- `GET /api/auth/me`;
- `POST /api/agendamentos`;
- `GET /api/agendamentos/meus`;
- `GET /api/agendamentos` para administração;
- `PATCH /api/agendamentos/{id}/status` para administração.

O `TatuadorService` e outros services de domínio ainda representam scaffolding de CRUD e não são usados pelo catálogo público. A URL de produção ainda precisa ser definida.
