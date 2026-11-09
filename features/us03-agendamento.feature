# language: pt
@US03 @RN03
Funcionalidade: Agendar envio da edição
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada, e poder reagendar ou cancelar
  Para que ela chegue no melhor horário sem eu precisar apertar o botão na hora

  Contexto:
    Dado que estou autenticada como gestora "Diana"
    E que existe a edição "Informativo #42" aprovada
    E que o segmento "Clientes Premium" tem 1200 assinantes

  @feliz @smoke
  Cenário: Agendamento com antecedência suficiente
    Dado que agora é 10/03/2026 às 08:00
    Quando agendo o envio para o segmento "Clientes Premium" daqui a 30 minutos
    Então o disparo deve estar agendado para 10/03/2026 às 08:30
    E devo ver a mensagem "Envio agendado"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos para agendar
    Quando agendo o envio para o segmento "Clientes Premium" daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                                                 |
      | 60      | Envio agendado                                           |
      | 16      | Envio agendado                                           |
      | 15      | Envio agendado                                           |
      | 14      | O envio precisa de ao menos 15 minutos de antecedência   |
      | 0       | O envio precisa de ao menos 15 minutos de antecedência   |

  @limite
  Esquema do Cenário: No máximo 2 reagendamentos por envio
    Dado que o envio está agendado para daqui a 60 minutos
    E que o total de reagendamentos já feitos é <feitos>
    Quando reagendo o envio para daqui a 120 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | feitos | mensagem                            |
      | 0      | Envio reagendado                    |
      | 1      | Envio reagendado                    |
      | 2      | Limite de 2 reagendamentos atingido |

  @alternativo
  Cenário: Cancelamento exatamente 5 minutos antes do envio
    Dado que faltam 5 minutos para o envio agendado
    Quando cancelo o envio
    Então devo ver a mensagem "Envio cancelado"
    E a edição deve estar "aprovada"

  @excecao
  Cenário: Cancelamento a 4 minutos do envio é recusado
    Dado que faltam 4 minutos para o envio agendado
    Quando cancelo o envio
    Então devo ver a mensagem "O envio só pode ser cancelado até 5 minutos antes do horário"
    E o disparo deve continuar agendado
