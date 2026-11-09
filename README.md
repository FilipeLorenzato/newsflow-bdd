# NewsFlow · BDD com Cucumber

Exercício de Teste de Software — *do Gherkin ao Cucumber*. Quatro histórias de usuário do
**NewsFlow** (plataforma de newsletters da Vértice), os cenários em Gherkin que as comprovam e a
suíte Cucumber.js que os executa sobre um domínio em memória.

**Integrantes:** Filipe Lorenzato · Felipe Birchal · Gabryelle Franco

## Como rodar

```bash
npm install          # instala o Cucumber.js (Node 18 ou superior)
npm test             # roda os 29 cenários e gera relatorios/cucumber-report.html
npm run test:dry     # valida a sintaxe e confere se todo passo tem implementação
```

## O que tem aqui

```
newsflow-bdd/
├── cucumber.js                      configuração (steps, formato progress + relatório HTML)
├── docs/historias.md                as quatro histórias com critérios de aceitação
├── features/
│   ├── us01-rascunho.feature        US01 · RN01
│   ├── us02-aprovacao.feature       US02 · RN02
│   ├── us03-agendamento.feature     US03 · RN03
│   ├── us04-segmentacao.feature     US04 · RN04
│   ├── support/
│   │   ├── dominio.js               regras de negócio em memória, com relógio simulado
│   │   └── world.js                 World (estado de cada cenário) e o tipo {datahora}
│   └── step_definitions/            passos: comum, rascunho, aprovação, agendamento
└── relatorios/cucumber-report.html  relatório gerado pelo npm test
```

## Histórias e rastreabilidade

As histórias seguem o caminho de uma edição: **escrever → aprovar → agendar → escolher o público**.
O texto completo, com critérios de aceitação e prioridade, está em [`docs/historias.md`](docs/historias.md).

| História | Regra | Cenários | Fronteiras testadas |
|---|---|---|---|
| **US01** Salvar rascunho automaticamente | RN01 | feliz, esquema (4 linhas), limite de 20 versões, restaurar, restaurar versão que saiu | 29 / 30 / 31 / 60 segundos · 20 versões |
| **US02** Aprovar edição antes do envio | RN02 | feliz, autora não aprova a própria, reprovação com comentário, reprovação sem comentário, agendar sem aprovação | — |
| **US03** Agendar envio da edição | RN03 | feliz, esquema de antecedência (5 linhas), esquema de reagendamento (3 linhas), cancelar a 5 min, cancelar a 4 min | 14 / 15 / 16 minutos · 2 reagendamentos · 5 minutos |
| **US04** Escolher os segmentos do envio | RN04 | feliz (assinante em dois segmentos), segmento vazio, esquema de quantidade (3 linhas) | 4 / 5 / 6 segmentos |

Tags para rodar recortes: `@US01`…`@US04`, `@RN01`…`@RN04`, `@feliz`, `@excecao`, `@alternativo`,
`@limite` e `@smoke` (um caminho feliz por história) — por exemplo `npx cucumber-js --tags "@limite"`.

### Como as regras foram interpretadas

- **RN01 — salvamento a cada 30 s:** a primeira alteração ainda não salva marca o próximo salvamento
  para 30 segundos depois. Assim, quem escreve sem parar tem uma versão a cada 30 segundos, e
  ficar parado não cria versões repetidas (por isso 60 s sem digitar ainda dá 1 versão).
- **RN01 — restauração:** restaurar traz o texto de volta como uma alteração nova; as versões
  seguintes continuam no histórico. Versões fora das 20 mais recentes mostram um aviso.
- **RN03 — limites:** 15 minutos exatos de antecedência são aceitos; cancelar com 5 minutos
  exatos de antecedência é aceito ("até 5 minutos antes"); com 4, não. Horários sempre em
  America/Sao_Paulo e comparados como instantes, não como texto.
- **RN04 — duplicidade:** os destinatários do disparo são a união dos segmentos, então quem está
  em dois segmentos conta uma vez só.

### Como os testes foram construídos

- O tempo é simulado: `fico 30 segundos sem digitar` avança o relógio do domínio, sem nenhum
  `sleep`. A suíte inteira roda em milissegundos.
- Todo estado fica no **World**, recriado a cada cenário; nenhum cenário depende de outro, e a
  suíte também passa com `--parallel 2`.
- Os passos de preparação usam o caminho real do domínio (por exemplo, "já tem 25 versões salvas"
  escreve e espera 25 vezes; "faltam 4 minutos" agenda e deixa o relógio correr).
- Os mesmos passos servem a várias histórias: `devo ver a mensagem {string}`,
  `a edição deve estar/continuar {string}` e `que estou autenticado/autenticada como {word} {string}`.

## Fora de escopo

Quatro regras ficaram fora para que as quatro histórias formassem um fluxo completo e bem testado,
da escrita ao disparo:

- **RN05 — Frequência semanal:** depende de um histórico de envios por assinante e de uma fila entre semanas; é uma história própria do lado do assinante e não muda o fluxo editorial.
- **RN06 — Descadastro e duplo opt-in:** acontece depois que o e-mail chega, envolve confirmação por e-mail e prazo de 48 horas; merece uma história do assinante separada.
- **RN07 — Falha de entrega:** é responsabilidade da operação, depois do disparo, e exige simular um provedor de e-mail com bounces.
- **RN08 — Notificação push:** é outro canal, com janela de silêncio e limite diário próprios; testar junto com o e-mail inflaria as histórias.

## Saída do `npm test`

Execução real no GitHub Actions (atualizada automaticamente a cada envio ao repositório):

<!-- SAIDA-NPM-TEST:INICIO -->
```text
$ npm test
> newsflow-bdd@1.0.0 test
> cucumber-js

.............................................................................................................................................................................

29 scenarios (29 passed)
173 steps (173 passed)
0m00.055s (executing steps: 0m00.010s)
```
<!-- SAIDA-NPM-TEST:FIM -->

## Relatório

O relatório navegável do Cucumber, com cada cenário, cada passo e o tempo de execução, está em
[`relatorios/cucumber-report.html`](relatorios/cucumber-report.html). Ele é gerado pelo `npm test`
e regravado pelo GitHub Actions a cada envio ao repositório. Para ver, baixe o arquivo
(botão *Download raw file*) e abra no navegador.
