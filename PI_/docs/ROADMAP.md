# Roadmap — Code Ink

Atualizado em 17/08/2026. Este roadmap deriva do estado confirmado no código, nos testes e na validação manual Full Stack; não representa compromisso de prazo.

## Base atual

- [x] frontend Angular standalone estruturado;
- [x] frontend Angular e backend Spring Boot no mesmo repositório, integrados a um banco MySQL externo;
- [x] páginas públicas e catálogo visual local;
- [x] cadastro e login reais com JWT e BCrypt;
- [x] interceptor e guards por perfil no Angular;
- [x] autorização por roles no Spring Security para os fluxos principais;
- [x] criação de agendamento vinculada ao usuário autenticado;
- [x] relacionamento JPA por `agendamentos.cliente_id`;
- [x] consulta de “Meus agendamentos” pelo ID do cliente;
- [x] dashboard e atualização administrativa de status via API;
- [x] 34 testes frontend e 25 testes backend aprovados;
- [x] builds de produção confirmados em 17/08/2026;
- [ ] CRUD completo de tatuadores e catálogos;
- [ ] recuperação de senha e refresh token;
- [ ] migrations e configuração de produção;
- [ ] cobertura end-to-end automatizada.

Os itens concluídos descrevem o MVP atual. Eles não significam que todas as áreas visíveis ou todos os controllers estejam completos.

## Prioridade 0 — autorização e fronteira de confiança

- [ ] corrigir a regra de escrita em `/api/tatuadores/**`, hoje acessível a qualquer usuário autenticado;
- [ ] definir explicitamente quais perfis podem criar, alterar e excluir tatuadores;
- [ ] adicionar testes de segurança que rejeitem `CLIENTE` nessas operações;
- [ ] revisar os demais matchers do `SecurityConfig` antes de ativar novos CRUDs;
- [ ] manter ownership de agendamentos exclusivamente no backend;
- [ ] decidir se a rota Angular `/agendamento` deve receber um guard de `CLIENTE` ou redirecionar no momento do envio.

Essa prioridade deve ser tratada antes de apresentar `/api/tatuadores/**` como CRUD funcional.

## Prioridade 1 — consolidar os fluxos integrados

### Agendamentos

- [x] criar agendamento pela API;
- [x] forçar status inicial `Pendente` no backend;
- [x] associar o registro ao `Usuario` autenticado;
- [x] consultar os próprios registros por `cliente_id`;
- [x] listar registros para `ADMIN`;
- [x] atualizar status pela API;
- [ ] formalizar estados e transições permitidas no backend;
- [ ] implementar disponibilidade e detecção de conflito de horário;
- [ ] concluir ou remover as operações por ID ainda não implementadas;
- [ ] decidir quando remover os métodos e chaves locais legados do frontend.

### Autenticação

- [x] cadastro público exclusivo para `CLIENTE`;
- [x] login para `CLIENTE`, `TATUADOR` e `ADMIN` provisionados;
- [x] senha com BCrypt;
- [x] emissão e validação de JWT;
- [x] restauração da sessão por `/api/auth/me`;
- [x] respostas `401` e `403` sem expor senha;
- [ ] implementar recuperação de senha, se entrar no escopo;
- [ ] decidir estratégia de refresh e revogação de token;
- [ ] definir política de expiração para ambientes reais.

### Testes

- [x] services de autenticação e agendamento no Angular;
- [x] interceptor e guards Angular;
- [x] autenticação, segurança, controller, service e repository no backend;
- [x] teste de repository separando usuários com o mesmo nome por ID;
- [ ] automatizar o fluxo end-to-end Angular → API → banco;
- [ ] cobrir a matriz completa de endpoints e perfis;
- [ ] testar estados de loading, erro e indisponibilidade do backend.

## Prioridade 2 — evoluir o catálogo sem inventar integração

- [ ] concluir regras e services do backend para tatuadores;
- [ ] corrigir a autorização antes de conectar a interface;
- [ ] definir DTOs compatíveis com os cards e perfis do Angular;
- [ ] migrar o catálogo público de `CatalogoService` para API somente depois disso;
- [ ] implementar portfólio de forma incremental;
- [ ] decidir o domínio de flash tattoos e sua persistência;
- [ ] manter fallback, erros e estados vazios claros durante cada migração;
- [ ] criar testes por recurso integrado.

Até essa etapa ser concluída, tatuadores, portfólio, flash tattoos e avaliações devem continuar documentados como dados de catálogo local.

## Prioridade 3 — completar funcionalidades visíveis

- [ ] edição de informações pessoais;
- [ ] favoritos persistentes;
- [ ] inspirações salvas;
- [ ] configurações de conta;
- [ ] upload persistente de referência do agendamento;
- [ ] agenda e disponibilidade reais;
- [ ] CRUD administrativo de portfólio;
- [ ] CRUD administrativo de tatuadores;
- [ ] CRUD administrativo de flash tattoos;
- [ ] contato com envio real;
- [ ] fluxo de pagamento;
- [ ] área de tatuador, se aprovada.

## Prioridade 4 — qualidade e entrega

- [ ] formalizar requisitos, regras de negócio e critérios de aceite;
- [ ] criar contrato OpenAPI;
- [ ] substituir `ddl-auto=update` por migrations versionadas para produção;
- [ ] definir URLs, CORS e segredos por ambiente;
- [ ] adicionar pipeline de CI para builds e testes;
- [ ] executar auditoria de acessibilidade;
- [ ] validar responsividade em uma matriz de dispositivos e navegadores;
- [ ] revisar dados institucionais e direitos das imagens;
- [ ] definir licença e guia de contribuição;
- [ ] documentar estratégia de deploy e demonstração de portfólio.

## Próxima sessão recomendada

Corrigir e testar a autorização de escrita em `/api/tatuadores/**` sem implementar ainda o CRUD completo.

Objetivo:

- fazer o Spring Security rejeitar um `CLIENTE` antes de a requisição chegar ao `TatuadorService`;
- preservar o acesso público somente às leituras confirmadas;
- registrar com testes quais roles podem executar cada operação.

Arquivos provavelmente envolvidos quando essa tarefa for autorizada:

```text
burger/src/main/java/com/pi/code_ink/security/SecurityConfig.java
burger/src/test/java/com/pi/code_ink/security/AuthSecurityIntegrationTest.java
burger/docs/AUTHENTICATION.md
```

Conhecimentos praticados:

- autenticação versus autorização;
- ordem de matchers do Spring Security;
- princípio do menor privilégio;
- testes de integração com respostas `401` e `403`.

## Regra de atualização

Atualize este arquivo somente quando uma prioridade for confirmada, concluída ou descartada. Registre o trabalho realizado no `LEARNING_LOG.md`; não use o roadmap como diário de sessão.
