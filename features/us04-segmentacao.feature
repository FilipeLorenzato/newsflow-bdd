# language: pt
@US04 @RN04
Funcionalidade: Escolher os segmentos do envio
  Como gestora de comunicação
  Quero escolher para quais segmentos a edição vai
  Para que cada público receba só o que interessa, sem receber o mesmo e-mail repetido

  Contexto:
    Dado que estou autenticada como gestora "Diana"
    E que existe a edição "Informativo #42" aprovada

  @feliz @smoke
  Cenário: Assinante que está em dois segmentos recebe um único e-mail
    Dado que o segmento "Clientes Premium" tem 1200 assinantes
    E que o segmento "Belo Horizonte" tem 300 assinantes
    E que 100 assinantes estão tanto em "Clientes Premium" quanto em "Belo Horizonte"
    Quando agendo o envio para os segmentos "Clientes Premium" e "Belo Horizonte" daqui a 30 minutos
    Então o disparo deve ter 1400 destinatários
    E nenhum assinante deve receber a edição duas vezes

  @excecao
  Cenário: Segmento sem assinantes bloqueia o agendamento
    Dado que o segmento "Clientes Premium" tem 1200 assinantes
    E que o segmento "Ex-clientes" tem 0 assinantes
    Quando agendo o envio para os segmentos "Clientes Premium" e "Ex-clientes" daqui a 30 minutos
    Então devo ver a mensagem "Segmento sem assinantes: Ex-clientes"
    E o disparo não deve estar agendado

  @limite
  Esquema do Cenário: Uma edição vai para no máximo 5 segmentos
    Dado que existem 6 segmentos com 100 assinantes cada
    Quando agendo o envio para <quantidade> desses segmentos daqui a 30 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | quantidade | mensagem                                       |
      | 4          | Envio agendado                                 |
      | 5          | Envio agendado                                 |
      | 6          | Uma edição pode ir para no máximo 5 segmentos  |
