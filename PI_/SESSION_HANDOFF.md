# Code Ink — Handoff MVP

Atualizado em 04/08/2026.

## Estado atual após a integração de autenticação

- Branch de trabalho: `mvp/auth-jwt-roles`.
- Login, cadastro de cliente, `/api/auth/me`, JWT, interceptor e guards estão integrados.
- O token e o usuário mínimo ficam em `sessionStorage`; o backend continua sendo a fonte de autoridade.
- A senha fixa e a autenticação simulada foram removidas do fluxo ativo.
- Validação atual: 22 testes backend, 33 testes frontend e build Angular aprovados.

## Histórico da etapa de agendamentos

- Branch atual: `mvp/angular-agendamentos`.
- `GET /api/agendamentos` funcionando.
- `POST /api/agendamentos` funcionando.
- Angular lista agendamentos pelo backend.
- A tela `/agendamento` envia o cadastro real ao backend.
- `origin/main` foi mergeada sem conflitos.
- Testes pós-merge: 21 aprovados.
- Build Angular pós-merge: aprovado.

## Commits desta etapa

- `952739d feat: integrate agendamento form with backend`
- `78368cb docs: update MVP handoff`
- `715cf77 Merge remote-tracking branch 'origin/main' into mvp/angular-agendamentos`

Commits trazidos de `origin/main`:

- `91da338 feat: atualiza imagens e visual da home`
- `2e705d8 feat: atualiza imagens e dados do portfolio`
- `ba71aa7 fix: adiciona imagem do beija-flor ao portfolio`

## Como rodar o backend

```bat
cd /d "C:\Users\fabri\OneDrive\Documentos\Projeto Integrador\CODEINK\burger"
set "DB_USERNAME=code_ink_app"
set "DB_PASSWORD=SUA_SENHA_LOCAL"
.\mvnw.cmd spring-boot:run
```

## Como rodar o Angular

```bat
cd /d "C:\Users\fabri\OneDrive\Documentos\Projeto Integrador\CODEINK\PI_"
npm install
npm start
```

## Fluxo validado

1. Acessar `http://localhost:4200/agendamento`.
2. Preencher as etapas do formulário.
3. Confirmar o envio.
4. Verificar o `POST http://localhost:8080/api/agendamentos`.
5. Abrir `/dashboard/agendamentos` e confirmar o novo registro.

## Próxima etapa

Continuar o CRUD de agendamentos no computador do curso, começando por conectar confirmar/cancelar aos endpoints reais do backend.

Não adicionar senhas reais, tokens ou credenciais a este arquivo.
