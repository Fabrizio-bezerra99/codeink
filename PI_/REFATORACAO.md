# Histórico da refatoração visual

Este documento preserva o contexto da migração que originou a interface atual. O estado operacional deve ser consultado no `README.md` e em `docs/ARCHITECTURE.md`.

## Origem registrada

O registro anterior informa que um protótipo chamado **Prototipar site com imagem**, produzido em React/TSX com Tailwind e bibliotecas externas, foi reescrito para o projeto Angular.

O protótipo original não está neste repositório. Portanto, a equivalência completa entre ele e a implementação atual não pode ser verificada somente pelo código disponível.

TODO: adicionar link ou referência versionada ao arquivo de design/protótipo, se o grupo quiser manter rastreabilidade da conversão.

## Resultado confirmado no repositório atual

- aplicação Angular standalone;
- páginas carregadas sob demanda com `loadComponent`;
- componentes compartilhados de layout, navbar, footer, cabeçalho e cards;
- estado local com signals e `computed` em telas apropriadas;
- Reactive Forms em login, cadastro e contato;
- estilos CSS globais e isolados por componente;
- media queries para adaptação de layout;
- mocks centralizados em `src/app/core/data/catalogo.mock.ts`;
- imagem principal local em `public/images/studio-hero.jpeg`;
- nenhuma dependência React, MUI, Radix ou Tailwind declarada em `package.json`.

## Organização adotada

```text
src/app/pages/          # páginas completas
src/app/shared/         # componentes reutilizáveis e layout
src/app/core/data/      # dados mockados
src/app/core/services/  # estado local e scaffolding HTTP
src/app/core/guards/    # proteção de rotas
src/app/models/         # domínio e modelos de apresentação
public/images/          # assets locais
```

## Páginas presentes

- home;
- portfólio;
- detalhes da tattoo;
- flash tattoos;
- tatuadores;
- perfil do tatuador;
- agendamento;
- contato;
- login;
- cadastro;
- perfil do cliente;
- dashboard;
- gestão administrativa de agendamentos;
- página 404.

A página de gestão administrativa e a persistência mais completa de agendamentos foram adicionadas depois do registro inicial da refatoração.

## Limites

- A interface usa mocks e `localStorage`; não há API integrada às páginas.
- A existência de markup semântico e atributos ARIA não comprova conformidade integral de acessibilidade.
- “Conversão completa” deve ser entendida como histórico informado, não como comparação validada nesta auditoria.

## Validação atual

Executado em 27/07/2026:

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
.\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit
```

Resultados:

- build aprovado;
- compilação Angular sem emissão aprovada;
- 2 arquivos de teste e 2 testes aprovados.

A cobertura automatizada atual é limitada ao shell da aplicação e à criação da navbar.
