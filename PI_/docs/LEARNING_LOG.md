# Learning Log - Code Ink

## 2026-07-30 - Sincronização do autocomplete no cadastro

### O que fiz

- Corrigi a sincronização entre os valores exibidos pelo preenchimento automático do navegador e o Reactive Form do cadastro.
- Adicionei identificadores aos campos do formulário e sincronizei seus valores antes da validação do cadastro.
- Criei um teste de regressão que simula valores preenchidos visualmente sem eventos de digitação.

### O que aprendi

- O valor exibido em um `input` pode ser diferente do valor armazenado no `FormControl` quando o navegador preenche o campo automaticamente.
- Um teste de regressão protege um comportamento corrigido para que ele não volte a falhar em alterações futuras.
- Testes de componentes podem usar um dublê para evitar que uma navegação real interfira na verificação de um comportamento específico.

### Validações

- Teste direcionado do cadastro: 1 arquivo e 3 testes aprovados.
- Prettier aprovado nos arquivos HTML, TypeScript e spec do cadastro.
- Suíte completa: 5 arquivos e 16 testes aprovados.
- Build de produção aprovado.
- Teste manual do autocomplete no cadastro confirmado pelo estudante.

### Observação

- O autocomplete real não foi reproduzido no navegador de teste porque não havia dados salvos. O cenário foi coberto por um teste automatizado que atribui valores visuais sem disparar eventos de digitação.

### Próximo passo

Revisar o diff final e preparar o commit manualmente.

## 2026-07-29 - Fechamento da revisão de acessibilidade

### O que fiz

- Adicionei o controle independente de mostrar e ocultar a confirmação da senha.
- Criei o teste correspondente e validei a suíte completa com 5 arquivos e 15 testes.
- Realizei uma verificação manual de teclado no login e observei o cadastro no navegador.

### O que aprendi

- Um controle precisa ter estado próprio quando dois campos podem ser exibidos de forma independente.
- O valor visual preenchido pelo navegador pode não estar sincronizado com o estado interno do Reactive Form.

### Dificuldades

- O autocomplete exibiu valores no cadastro, mas a validação continuou indicando campos inválidos.
- O acesso ao projeto no OneDrive exigiu uma execução de testes com permissão ampliada.

### Decisões importantes

- Mantive o status da tarefa no Notion como Em revisão.
- Não corrigi o autocomplete nesta sessão; ele será tratado como a próxima tarefa.
- Não criei commit para as últimas alterações.

### Próximo passo

Investigar a sincronização do autocomplete com o Reactive Form, executar o build final e depois revisar o diff para preparar o commit manualmente.

## 2026-07-29 - Acessibilidade e testes de componentes

### O que fiz

- Validei os controles de mostrar e ocultar senha no login e cadastro.
- Usei `aria-label` para descrever a ação do botão.
- Usei `aria-pressed` para representar o estado do botão.
- Criei testes de componente para login e cadastro.
- Corrigi a estrutura do teste de cadastro, que inicialmente ficou dentro do `afterEach`.
- Mantive os registros históricos anteriores sem alterações.

### O que aprendi

- A diferença entre texto visual e nome acessível.
- Como um valor booleano representa o estado de um controle.
- Como usar `TestBed` para criar um componente em teste.
- Como `fixture.detectChanges()` atualiza o template.
- Como simular um clique e verificar mudanças no DOM.
- A importância de manter cada teste diretamente dentro do `describe`.

### Dificuldades

- O primeiro teste do cadastro não foi encontrado porque o bloco `it` estava dentro do `afterEach`.
- O servidor local não conseguiu permanecer ativo para uma auditoria visual manual.

### Validações

- Prettier aprovado.
- Teste do login aprovado.
- Teste do cadastro aprovado após a correção estrutural.
- Suíte completa: 5 arquivos e 14 testes aprovados.
- `ngc --noEmit` aprovado.
- Build de produção aprovado.

### Arquivos envolvidos

- `src/app/pages/login-componente/login-componente.html`
- `src/app/pages/cadastro-componente/cadastro-componente.html`
- `src/app/pages/login-componente/login-componente.spec.ts`
- `src/app/pages/cadastro-componente/cadastro-componente.spec.ts`

### Próximo passo

Realizar uma revisão manual de acessibilidade, teclado e responsividade quando o servidor local estiver disponível.

## 2026-07-28 - Testes automatizados do AgendamentoService

### O que fiz

- Criei `src/app/core/services/agendamento-service.spec.ts` com 10 testes para listagem, cadastro, persistência, atualização de status, deduplicação, ID inexistente, chave legada e JSON inválido.
- Executei a suíte completa com `npm.cmd test -- --watch=false`: 3 arquivos e 12 testes passaram.

### O que aprendi

- Pratiquei TestBed, injeção de dependência, isolamento do `localStorage`, Arrange–Act–Assert e lógica com `find`, `filter`, `map`, condições e retornos booleanos.
- Entendi a diferença entre alterar dados em memória e persistir uma mudança no navegador.

### Dificuldades

- Corrigi um teste aninhado dentro de outro e revisei o escopo das variáveis e os fechamentos `});`.
- A primeira execução foi bloqueada pelo sandbox; a suíte passou com acesso normal ao projeto.
- A checagem do Prettier ainda aponta problemas de formatação no novo arquivo.

### Decisões importantes

- `AgendamentoService` não foi alterado porque os testes não confirmaram defeitos na implementação atual.
- A tarefa permanece em revisão até a formatação, a compilação e o build final.

### Próximo passo

Formatar o arquivo de testes, executar `ngc --noEmit`, build de produção e a suíte completa, revisar o diff e preparar um commit isolado.

## 2026-07-27 - Auditoria completa da documentação

### Tipo de tarefa

Documentação e análise. Nenhum arquivo de código-fonte foi alterado.

### O que foi realizado

- Leitura da estrutura completa do frontend, incluindo configuração, rotas, pages, componentes compartilhados, services, models, guards, mocks, templates, estilos e testes.
- Comparação do código atual com README, contexto, análise antiga, histórico da refatoração e Learning Log.
- Preenchimento de `ARCHITECTURE.md` e `ROADMAP.md`, que estavam vazios.
- Atualização do README com escopo real, execução, credenciais, persistência, limites e cobertura de testes.
- Substituição da análise de 17/07 por uma auditoria do estado atual.
- Separação explícita entre funcionalidades implementadas, simulações locais, scaffolding de API e TODOs.
- Correção da referência do repositório remoto para `ProjetoIntegradorGrupo.git`.
- Registro de arquivos candidatos a revisão sem removê-los.

### Inconsistências encontradas

- A análise antiga registrava erros de compilação e configuração que já foram corrigidos no código atual.
- A rota `/dashboard/agendamentos` e a gestão local de status ainda não estavam no mapa documental.
- A persistência de agendamentos combina mocks, `codeInk.agendamentos` e uma chave legada, não apenas mocks.
- Backend, banco e Flutter eram mencionados como direção do projeto, mas não existem nesta raiz.
- Vários controles visuais ainda não possuem comportamento completo, como recuperação de senha, edição de perfil, configurações e gestão de catálogos.
- Os testes existentes cobrem somente a criação do componente raiz e da navbar.

### Conceitos praticados

- Documentação como contrato do estado real do software.
- Diferença entre funcionalidade implementada, mock, scaffolding e roadmap.
- Rastreabilidade entre rota, componente, service, model e fonte de dados.
- Importância de não transformar intenção futura em afirmação de entrega.
- Uso de TODO para decisões que o código não permite confirmar.
- Validação documental por build, compilador e testes.

### Validações realizadas

```powershell
npm.cmd run build
npm.cmd test -- --watch=false
.\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit
```

Resultados:

- build de produção aprovado;
- compilação Angular sem emissão aprovada;
- 2 arquivos de teste e 2 testes aprovados;
- diff final limitado a arquivos de documentação.

### Próximo passo sugerido

Criar testes automatizados para `AgendamentoService`, cobrindo carregamento, migração da chave legada, prevenção de duplicidade, geração de IDs e regras de mudança de status.

## 2026-07-26 - Gestão administrativa de status dos agendamentos

### O que foi desenvolvido

- Criação das ações para confirmar e cancelar agendamentos na área administrativa.
- Integração da página administrativa com o `AgendamentoService`.
- Atualização imediata da lista após a alteração de um status.
- Persistência dos novos status no `localStorage`.
- Bloqueio das ações conforme o estado atual do agendamento.
- Estilização da página administrativa, tabela, botões e indicadores de status.
- Correção do menu mobile para mostrar `Minha conta` quando o usuário está autenticado.
- Configuração explícita de `rootDir` no `tsconfig.app.json` para compatibilidade com o TypeScript 6.

### Regras de status aplicadas

- Um agendamento pendente pode ser confirmado ou cancelado.
- Um agendamento confirmado ainda pode ser cancelado.
- Um agendamento cancelado não pode ser reaberto pela interface.
- Um agendamento finalizado não pode ser alterado.

### Problemas encontrados

- Ao atualizar um agendamento mock, o novo status era salvo no `localStorage`, mas a tabela continuava exibindo a lista antiga até a página ser recarregada.
- O problema foi resolvido buscando uma nova lista no service depois da atualização.
- O menu mobile sempre mostrava `Entrar`, mesmo quando o usuário estava autenticado.
- O problema acontecia porque a versão mobile possuía um link fixo e não consultava o `AuthService`.

### Conceitos praticados

- Comunicação entre componente e service.
- Eventos de clique com `(click)`.
- Propriedades condicionais com `[disabled]`.
- Classes CSS condicionais com `[class.nome-da-classe]`.
- Tipagem de status com `StatusAgendamento`.
- Diferença entre alterar os dados salvos e atualizar a referência exibida pela tela.
- Uso do retorno booleano para verificar se uma atualização foi realizada.
- Persistência de dados no `localStorage`.
- Isolamento de estilos entre componentes Angular.
- Renderização condicional com `@if` e `@else`.
- Formatação automática com Prettier.
- Diferença entre `rootDir` e `outDir` no TypeScript.

### Testes realizados

- Compilação Angular executada com:

```powershell
.\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit
```

Resultado: passou sem erros.

- Testes automatizados executados com:

```powershell
npm test -- --watch=false
```

Resultado: 2 arquivos de teste e 2 testes passaram.

- Teste completo do fluxo entre cliente, agendamento, perfil e administração.
- Alteração dos status dos agendamentos mocks e de um novo agendamento.
- Persistência dos status após atualizar a página com F5.
- Verificação de que os agendamentos não aparecem duplicados.
- Verificação dos status no Dashboard e no perfil do cliente.
- Verificação do menu mobile para usuários autenticados.

### Próximo passo sugerido

Criar testes automatizados para o `AgendamentoService`, cobrindo atualização de mocks, persistência dos status e prevenção de registros duplicados. Depois, realizar a revisão final de responsividade e acessibilidade do frontend.

## 2026-07-22 - Guards e redirecionamento apos login

### O que foi desenvolvido

- Melhoria no `clienteGuard` para redirecionar usuarios nao autenticados para o login mantendo a URL original.
- Melhoria no `adminGuard` com a mesma logica de redirecionamento.
- O acesso a `/perfil` agora pode redirecionar para `/login?redirect=/perfil`.
- O acesso a `/dashboard` agora pode redirecionar para `/login?redirect=/dashboard`.

### Conceitos praticados

- `Guard`: funciona como um porteiro de rota, decidindo se uma pagina pode ser acessada.
- `CanActivateFn`: funcao do Angular usada para permitir ou bloquear uma rota.
- `state.url`: guarda a URL que o usuario tentou acessar antes de ser redirecionado.
- `queryParams`: parametros enviados na URL, usados aqui para guardar o destino original.
- Redirecionamento apos login: melhora a experiencia do usuario porque o sistema lembra para onde ele queria ir.

### Dificuldades e aprendizados

- Foi necessario entender que `(_route, state)` permite acessar informacoes da navegacao atual.
- O parametro `_route` foi mantido com underline porque o Angular entrega esse valor, mas ele nao foi usado nesta melhoria.
- A logica principal aprendida foi:

```text
Se o perfil tem permissao, deixa entrar.
Se nao tem permissao, manda para login e guarda a URL original.
```

### Testes realizados

- Foi executada a checagem de compilacao do Angular:

```bash
.\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit
```

Resultado:

```text
Passou sem erros.
```

- Tambem foi feito teste manual do fluxo de redirecionamento.

### Proximo passo sugerido

Exibir o ultimo agendamento salvo no perfil do cliente, conectando o fluxo de agendamento com a area do usuario.

## 2026-07-21 - Fluxo de agendamento no Angular

### O que foi desenvolvido

- Melhoria no fluxo de agendamento do Code Ink.
- Criação de um resumo estruturado do agendamento escolhido pelo cliente.
- Exibição do resumo na tela de confirmação.
- Criação da ação "Novo agendamento" para reiniciar o fluxo.
- Salvamento do último agendamento no `localStorage` como demonstração.
- Ajuste do texto da confirmação para deixar claro que os dados ainda não são enviados para uma API real.

### Conceitos praticados

- `signal`: usado para guardar valores que mudam na tela, como etapa, opção, artista, data e horário.
- `computed`: usado para calcular automaticamente o resumo do agendamento a partir das escolhas do usuário.
- Operador ternário: usado para transformar a opção escolhida em um texto amigável para o cliente.
- `localStorage`: usado para salvar dados simples no navegador durante a simulação.
- `JSON.stringify`: usado para transformar o objeto do resumo em texto antes de salvar no `localStorage`.
- Separação entre lógica e visual: o TypeScript organiza os dados e o HTML apenas exibe as informações.

### Dificuldades e aprendizados

- Foi necessário entender a diferença entre valor vazio, `null` e `0`:
  - `0` representa a primeira etapa do fluxo.
  - `null` representa uma escolha que ainda não foi feita.
  - `''` representa texto vazio.
- Também foi praticada a leitura de mensagens de erro do Angular, especialmente quando havia problema de template.
- A indentação do HTML foi revisada para deixar o código mais legível.

### Testes realizados

- Foi executada a checagem de compilação do Angular:

```bash
.\node_modules\.bin\ngc.cmd -p tsconfig.app.json --noEmit
```

Resultado:

```text
Passou sem erros.
```

### Próximo passo sugerido

Exibir o último agendamento salvo no perfil do cliente, ainda de forma simulada, preparando o projeto para uma futura integração com a API Spring Boot.
