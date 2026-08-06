# Contas locais de teste

O cadastro público cria somente usuários `CLIENTE`. Para preparar uma conta
`ADMIN` e uma conta `TATUADOR`, o backend possui o seeder desativado por padrão:

`src/main/java/com/pi/code_ink/config/DevUserSeeder.java`

Ele prepara estas contas:

- `fabricio@gmail.com` com perfil `CLIENTE`;
- `admin@gmail.com` com perfil `ADMIN`;
- `carlos@gmail.com` com perfil `TATUADOR`.

As senhas são lidas de variáveis locais, recebem BCrypt e não são gravadas no
código. Todas precisam ter pelo menos 8 caracteres:

```powershell
$env:SEED_FABRICIO_PASSWORD = "<senha com pelo menos 8 caracteres>"
$env:SEED_ADMIN_PASSWORD = "<senha com pelo menos 8 caracteres>"
$env:SEED_CARLOS_PASSWORD = "<senha com pelo menos 8 caracteres>"
```

Com `DB_PASSWORD` e `JWT_SECRET` configurados no ambiente local, execute na
pasta do backend:

```powershell
./mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=seed-users"
```

Depois que as três mensagens de usuário preparado aparecerem, encerre o
backend. O login no site usa o email e a senha original informada nas
variáveis. O hash BCrypt armazenado no MySQL não é usado como senha de login.
