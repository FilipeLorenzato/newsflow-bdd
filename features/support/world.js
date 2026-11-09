// O World é a "memória" de um cenário: o Cucumber cria um novo antes de cada cenário,
// então nenhum cenário enxerga o que outro fez.
const { setWorldConstructor, defineParameterType } = require('@cucumber/cucumber')
const { Servico, ErroDeRegra, SEGUNDO, MINUTO } = require('./dominio')

// {datahora}: "10/03/2026 às 08:30", sempre no horário de Brasília (America/Sao_Paulo, UTC-3).
defineParameterType({
  name: 'datahora',
  regexp: /\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}/,
  transformer (texto) {
    const [, dia, mes, ano, hora, minuto] = texto.match(/(\d{2})\/(\d{2})\/(\d{4}) às (\d{2}):(\d{2})/)
    return new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:00-03:00`)
  }
})

// Papéis escritos no feminino ou no masculino viram um único papel do domínio.
const PAPEIS = {
  redator: 'redator',
  redatora: 'redator',
  revisor: 'revisor',
  revisora: 'revisor',
  gestor: 'gestor',
  gestora: 'gestor'
}

class MundoDoNewsFlow {
  constructor () {
    this.servico = new Servico()
    this.edicao = null
    this.resultado = null
  }

  papel (palavra) {
    const papel = PAPEIS[palavra]
    if (!papel) throw new Error(`Papel desconhecido no cenário: ${palavra}`)
    return papel
  }

  avancarSegundos (segundos) {
    this.servico.avancarRelogio(segundos * SEGUNDO, this.edicao ? [this.edicao] : [])
  }

  avancarMinutos (minutos) {
    this.avancarSegundos(minutos * 60)
  }

  daquiA (minutos) {
    return new Date(this.servico.agora().getTime() + minutos * MINUTO)
  }

  // Executa uma ação do usuário e guarda o que ele veria: a mensagem de sucesso ou a do erro de regra.
  executar (acao) {
    try {
      this.resultado = { sucesso: true, mensagem: acao() }
    } catch (erro) {
      if (!(erro instanceof ErroDeRegra)) throw erro
      this.resultado = { sucesso: false, mensagem: erro.message }
    }
  }
}

setWorldConstructor(MundoDoNewsFlow)
