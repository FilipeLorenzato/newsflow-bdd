# Histórias de usuário — NewsFlow

**Integrantes:** Filipe Lorenzato · Felipe Birchal · Gabryelle Franco

As quatro histórias seguem o caminho de uma edição desde a escrita até o disparo:
**escrever → aprovar → agendar → escolher para quem vai**. Cada uma é uma fatia
vertical: se fosse removida do produto, um ator perceberia a falta.

| ID   | Título                              | Ator     | Regras | Prioridade | Cenários |
|------|-------------------------------------|----------|--------|------------|----------|
| US01 | Salvar rascunho automaticamente     | Redatora | RN01   | Alta       | `features/us01-rascunho.feature` |
| US02 | Aprovar edição antes do envio       | Revisor  | RN02   | Alta       | `features/us02-aprovacao.feature` |
| US03 | Agendar envio da edição             | Gestora  | RN03   | Alta       | `features/us03-agendamento.feature` |
| US04 | Escolher os segmentos do envio      | Gestora  | RN04   | Média      | `features/us04-segmentacao.feature` |

---

## US01 — Salvar rascunho automaticamente

**Como** redatora
**Quero** que meu texto seja salvo automaticamente enquanto escrevo
**Para** não perder trabalho quando a conexão cair ou o navegador fechar

**Critérios de aceitação**
- Toda edição nova começa como rascunho.
- Uma alteração no texto é salva automaticamente 30 segundos depois de feita — nem antes, nem esperando mais.
- Cada salvamento cria uma versão com número sequencial.
- Apenas as 20 versões mais recentes ficam disponíveis para restauração; pedir uma versão mais antiga mostra um aviso.
- Restaurar uma versão traz o texto dela de volta sem apagar as versões seguintes.

**Regras cobertas:** RN01
**Prioridade:** Alta — perder o texto escrito é a pior experiência para o redator e afeta todas as edições.
**Cenários:** `features/us01-rascunho.feature`

---

## US02 — Aprovar edição antes do envio

**Como** revisor
**Quero** aprovar ou devolver uma edição com um comentário
**Para** garantir que nada saia para 40 mil assinantes sem uma segunda leitura, e que o redator saiba o que corrigir

**Critérios de aceitação**
- Um revisor pode aprovar uma edição escrita por outra pessoa.
- O autor não pode aprovar a própria edição, mesmo que também seja revisor.
- Reprovar devolve a edição ao rascunho e registra o comentário do revisor.
- Reprovar sem comentário não é permitido.
- Uma edição que ainda não foi aprovada não pode ser agendada.

**Regras cobertas:** RN02
**Prioridade:** Alta — é o controle que impede um erro de chegar à base inteira de uma vez; sem ela o agendamento não é seguro.
**Cenários:** `features/us02-aprovacao.feature`

---

## US03 — Agendar envio da edição

**Como** gestora de comunicação
**Quero** agendar o envio de uma edição aprovada, e poder reagendar ou cancelar
**Para** que ela chegue no melhor horário sem eu precisar apertar o botão na hora

**Critérios de aceitação**
- O envio só pode ser agendado para pelo menos 15 minutos à frente, no horário de Brasília (America/Sao_Paulo).
- Um envio agendado pode ser reagendado no máximo 2 vezes.
- O cancelamento é aceito até 5 minutos antes do horário marcado (5 minutos ainda pode).
- Depois de cancelado, a edição volta a ficar aprovada e sem envio marcado.

**Regras cobertas:** RN03
**Prioridade:** Alta — é o momento em que a edição vira comunicação real; os limites de horário evitam disparos acidentais.
**Cenários:** `features/us03-agendamento.feature`

---

## US04 — Escolher os segmentos do envio

**Como** gestora de comunicação
**Quero** escolher para quais segmentos a edição vai
**Para** que cada público receba só o que interessa, sem receber o mesmo e-mail repetido

**Critérios de aceitação**
- Uma edição pode ser enviada para até 5 segmentos.
- Um assinante que está em dois segmentos escolhidos recebe a edição uma única vez.
- Se algum segmento escolhido não tem assinantes, o agendamento é bloqueado e o segmento é informado.

**Regras cobertas:** RN04
**Prioridade:** Média — melhora a relevância e evita e-mail duplicado, mas o envio para um segmento já funciona pela US03.
**Cenários:** `features/us04-segmentacao.feature`
