# language: pt
@US01 @RN01
Funcionalidade: Salvar rascunho automaticamente
  Como redatora
  Quero que meu texto seja salvo automaticamente enquanto escrevo
  Para não perder trabalho quando a conexão cair ou o navegador fechar

  Contexto:
    Dado que estou autenticada como redatora "Ana"
    E que existe a edição "Informativo #42" em rascunho

  @feliz @smoke
  Cenário: Texto salvo automaticamente depois de 30 segundos
    Dado que escrevi "Novidades de março" na edição
    Quando fico 30 segundos sem digitar
    Então a quantidade de versões salvas deve ser 1
    E a versão 1 deve conter o texto "Novidades de março"

  @limite
  Esquema do Cenário: Momento exato do salvamento automático
    Dado que escrevi "Novidades de março" na edição
    Quando fico <segundos> segundos sem digitar
    Então a quantidade de versões salvas deve ser <versoes>

    Exemplos:
      | segundos | versoes |
      | 29       | 0       |
      | 30       | 1       |
      | 31       | 1       |
      | 60       | 1       |

  @limite
  Cenário: Apenas as 20 versões mais recentes ficam guardadas
    Dado que a edição já tem 20 versões salvas
    E que escrevi "Texto da versão 21" na edição
    Quando fico 30 segundos sem digitar
    Então a quantidade de versões salvas deve ser 20
    E a versão mais antiga disponível deve ser a 2

  @alternativo
  Cenário: Restaurar uma versão não apaga as versões seguintes
    Dado que a edição já tem 5 versões salvas
    Quando restauro a versão 2
    Então o texto atual da edição deve ser "Texto da versão 2"
    E a quantidade de versões salvas deve ser 5

  @excecao
  Cenário: Versão que já saiu do histórico não pode ser restaurada
    Dado que a edição já tem 25 versões salvas
    Quando restauro a versão 3
    Então devo ver a mensagem "A versão 3 não está mais disponível"
    E o texto atual da edição deve ser "Texto da versão 25"
