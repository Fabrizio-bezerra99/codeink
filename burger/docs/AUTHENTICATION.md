# Autenticação do Code Ink

## Configuração local

O backend exige uma chave JWT fora do Git:

```text
JWT_SECRET=<chave com pelo menos 32 bytes>
JWT_EXPIRATION_MS=3600000
```

`DB_PASSWORD` continua sendo fornecida somente pelo ambiente local. Nenhum valor real deve ser salvo neste repositório.

## Endpoints

### Cadastro público

`POST /api/auth/cadastro`

```json
{
  "nome": "Nome do cliente",
  "email": "cliente@example.com",
  "telefone": "21999999999",
  "senha": "<senha com pelo menos 8 caracteres>"
}
```

O backend normaliza o email, armazena a senha com BCrypt, define `CLIENTE` e retorna `201 Created` sem a senha. Email duplicado retorna `409 Conflict`.

### Login

`POST /api/auth/login`

```json
{
  "email": "cliente@example.com",
  "senha": "<senha cadastrada>"
}
```

A resposta retorna `token`, `tipo`, `usuarioId`, `nome`, `email` e `perfil`. Credenciais inválidas retornam `401 Unauthorized` com mensagem genérica.

### Usuário autenticado

`GET /api/auth/me` exige:

```text
Authorization: Bearer <token>
```

A resposta contém apenas `id`, `nome`, `email`, `telefone` e `perfil`.

## Perfis e autorização

- `CLIENTE`: pode criar agendamentos autenticados.
- `TATUADOR`: pode autenticar e acessar as operações de portfólio permitidas.
- `ADMIN`: pode acessar os endpoints administrativos e gerenciar agendamentos.
- O cadastro público não cria `TATUADOR` nem `ADMIN`.

Logout é local no frontend; não há blacklist nem refresh token nesta etapa.
