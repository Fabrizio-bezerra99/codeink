# Roadmap — Code Ink

Atualizado em 27/07/2026. Este roadmap deriva das lacunas confirmadas no código atual; não representa compromisso de prazo.

## Base atual

- [x] frontend Angular standalone estruturado;
- [x] páginas públicas e layout responsivo;
- [x] catálogo local de portfólio, flash tattoos e artistas;
- [x] autenticação demonstrativa no navegador;
- [x] fluxo local de agendamento;
- [x] guards de cliente e administrador;
- [x] dashboard e gestão local de status;
- [x] build de produção aprovado;
- [x] documentação de estado e arquitetura atualizada;
- [ ] integração com backend;
- [ ] banco de dados;
- [ ] autenticação real;
- [ ] aplicativo mobile;
- [ ] cobertura de testes dos fluxos principais.

Os itens marcados como concluídos descrevem somente o frontend e o comportamento local existentes. Eles não significam que o produto Full Stack está pronto.

## Prioridade 0 — decisões antes de implementar

### Requisitos e escopo

- [ ] confirmar os perfis definitivos: cliente, administrador e tatuador;
- [ ] definir requisitos funcionais e critérios de aceite;
- [ ] confirmar estados e transições de agendamento;
- [ ] definir regras de disponibilidade, conflito, cancelamento e pagamento;
- [ ] decidir quais botões visuais permanecerão no produto;
- [ ] confirmar se Flutter continua no escopo.

### Dados e identidade do projeto

- [ ] validar telefone, email, endereço, horários e redes sociais;
- [ ] confirmar direitos e origem das imagens;
- [ ] decidir se nomes, preços, avaliações e datas dos mocks serão mantidos;
- [ ] registrar a divisão atual da equipe.

### Higiene do repositório

- [ ] confirmar origem e necessidade de `GitFacil.exe`;
- [ ] decidir o destino de `Admin`, `AdminService`, guards e interceptor sem uso;
- [ ] decidir a padronização entre `portifolio` e `portfolio`;
- [ ] definir versão mínima de Node.js e registrá-la no projeto.

## Prioridade 1 — consolidar o frontend atual

### Testes

- [ ] testar `AuthService` e persistência da sessão;
- [ ] testar `AgendamentoService`, inclusive migração da chave legada;
- [ ] testar regras de mudança de status;
- [ ] testar `clienteGuard` e `adminGuard` com redirect;
- [ ] testar formulários de login, cadastro e contato;
- [ ] testar filtros de portfólio e flash tattoos;
- [ ] testar integração local entre agendamento, perfil e dashboard;
- [ ] definir comportamento esperado para IDs inexistentes.

### Coerência funcional

- [ ] decidir se `/agendamento` exige autenticação;
- [ ] definir vínculo estável entre usuário e agendamento, sem depender apenas do nome;
- [ ] alinhar o favorito do detalhe com os favoritos do perfil;
- [ ] remover, desabilitar ou identificar claramente ações ainda sem implementação;
- [ ] separar indicadores calculados de valores demonstrativos;
- [ ] centralizar estilos repetidos de login e cadastro quando houver autorização para refatorar.

### Qualidade

- [ ] executar auditoria de acessibilidade com ferramenta apropriada;
- [ ] testar navegação por teclado e leitores de tela;
- [ ] validar responsividade em uma matriz de telas e navegadores;
- [x] corrigir a sincronização do autocomplete com os Reactive Forms;
- [ ] revisar loading, erro e estados vazios;
- [ ] adicionar script de lint se a equipe escolher uma ferramenta.

## Prioridade 2 — preparar a integração real

Esta etapa só deve começar depois que o backend e seus contratos forem confirmados.

- [ ] localizar ou definir o repositório oficial da API;
- [ ] documentar endpoints e exemplos de request/response;
- [ ] definir DTOs e mapeadores entre domínio e models de tela;
- [ ] configurar URLs por ambiente;
- [ ] definir autenticação e armazenamento de token;
- [ ] implementar interceptor apenas com estratégia confirmada;
- [ ] padronizar tratamento de erros HTTP;
- [ ] confirmar CORS;
- [ ] substituir mocks de forma incremental;
- [ ] criar testes de integração para cada recurso migrado.

Ordem sugerida, sujeita à confirmação do grupo:

1. autenticação e sessão;
2. tatuadores e portfólio;
3. disponibilidade e agendamentos;
4. administração;
5. pagamentos;
6. contato/notificações.

## Prioridade 3 — completar funcionalidades visíveis

Somente após requisitos e API:

- [ ] recuperação de senha;
- [ ] edição de informações pessoais;
- [ ] favoritos persistentes;
- [ ] inspirações salvas;
- [ ] configurações de conta;
- [ ] seleção de trabalho do portfólio no agendamento;
- [ ] envio de referência;
- [ ] agenda e disponibilidade reais;
- [ ] CRUD administrativo de portfólio;
- [ ] CRUD administrativo de tatuadores;
- [ ] CRUD administrativo de flash tattoos;
- [ ] fluxo de pagamento;
- [ ] área de tatuador, se aprovada.

## Prioridade 4 — documentação de produto e entrega

- [ ] requisitos funcionais e não funcionais;
- [ ] regras de negócio;
- [ ] casos de uso e critérios de aceite;
- [ ] contrato OpenAPI;
- [ ] modelo de dados confirmado pelo backend;
- [ ] guia de contribuição;
- [ ] licença do projeto;
- [ ] estratégia de deploy e ambientes;
- [ ] CI para build e testes;
- [ ] política de privacidade, caso dados reais sejam coletados;
- [ ] guia de demonstração para portfólio e entrevistas.

## Próxima sessão recomendada

Investigar e corrigir a sincronização do preenchimento automático do cadastro com o Reactive Form. O problema foi observado quando o navegador exibiu valores preenchidos, mas a validação continuou indicando campos inválidos.

Arquivos provavelmente envolvidos quando essa tarefa for autorizada:

```text
src/app/pages/cadastro-componente/cadastro-componente.ts
src/app/pages/cadastro-componente/cadastro-componente.html
src/app/pages/cadastro-componente/cadastro-componente.spec.ts
```

Conhecimentos praticados:

- Reactive Forms e estado interno dos controles;
- eventos do navegador e autocomplete;
- sincronização entre DOM e estado Angular;
- testes de regressão;
- prevenção de mensagens de validação incorretas.

## Regra de atualização

Atualize este arquivo somente quando uma prioridade for confirmada, concluída ou descartada. Registre o trabalho realizado no `LEARNING_LOG.md`; não use o roadmap como diário de sessão.
