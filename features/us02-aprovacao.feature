# language: pt
@US02 @RN02
Funcionalidade: Aprovar edição antes do envio
  Como revisor
  Quero aprovar ou devolver uma edição com um comentário
  Para garantir que nada saia para os assinantes sem uma segunda leitura

  Contexto:
    Dado que a edição "Informativo #42" foi escrita pela redatora "Ana"
    E que ela foi enviada para revisão

  @feliz @smoke
  Cenário: Revisor aprova a edição de outra pessoa
    Dado que estou autenticado como revisor "Bruno"
    Quando aprovo a edição
    Então a edição deve estar "aprovada"
    E devo ver a mensagem "Edição aprovada"

  @excecao
  Cenário: Autora não aprova a própria edição
    Dado que estou autenticada como revisora "Ana"
    Quando aprovo a edição
    Então devo ver a mensagem "O autor não pode aprovar a própria edição"
    E a edição deve continuar "em revisão"

  @alternativo
  Cenário: Reprovação devolve a edição ao rascunho com o comentário
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição com o comentário "Corrigir a data do evento"
    Então a edição deve estar "em rascunho"
    E a edição deve ter o comentário "Corrigir a data do evento"

  @excecao
  Cenário: Reprovação sem comentário é recusada
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição sem comentário
    Então devo ver a mensagem "A reprovação exige um comentário"
    E a edição deve continuar "em revisão"

  @excecao
  Cenário: Edição sem aprovação não pode ser agendada
    Dado que estou autenticada como gestora "Diana"
    E que o segmento "Clientes Premium" tem 1200 assinantes
    Quando agendo o envio para o segmento "Clientes Premium" daqui a 30 minutos
    Então devo ver a mensagem "A edição precisa ser aprovada antes do envio"
    E o disparo não deve estar agendado
