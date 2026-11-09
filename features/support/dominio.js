// Domínio do NewsFlow em memória.
// Concentra as regras de negócio RN01–RN04; os steps só chamam estes métodos
// e conferem o resultado. O relógio é simulado: nenhum teste espera tempo real.

const SEGUNDO = 1000
const MINUTO = 60 * SEGUNDO

const INTERVALO_SALVAMENTO = 30 * SEGUNDO // RN01
const MAX_VERSOES = 20 // RN01
const ANTECEDENCIA_MINIMA = 15 * MINUTO // RN03
const MAX_REAGENDAMENTOS = 2 // RN03
const PRAZO_CANCELAMENTO = 5 * MINUTO // RN03
const MAX_SEGMENTOS = 5 // RN04

const ESTADO = {
  RASCUNHO: 'em rascunho',
  REVISAO: 'em revisão',
  APROVADA: 'aprovada',
  AGENDADA: 'agendada'
}

// Erro de regra de negócio: vira a mensagem que o usuário vê.
class ErroDeRegra extends Error {}

class Relogio {
  constructor (inicio) {
    this.instante = inicio.getTime()
  }

  agora () {
    return new Date(this.instante)
  }

  definir (data) {
    this.instante = data.getTime()
  }
}

class Servico {
  constructor () {
    // Instante inicial padrão: 10/03/2026 08:00 em America/Sao_Paulo (UTC-3).
    this.relogio = new Relogio(new Date('2026-03-10T08:00:00-03:00'))
    this.usuarioAtual = null
    this.segmentos = new Map()
    this.proximoAssinante = 1
  }

  // ---------- tempo ----------

  agora () {
    return this.relogio.agora()
  }

  definirAgora (data) {
    this.relogio.definir(data)
  }

  // Avança o relógio e executa, na ordem, os salvamentos automáticos que vencerem no caminho.
  avancarRelogio (ms, edicoes = []) {
    const destino = this.relogio.instante + ms
    for (const edicao of edicoes) {
      if (edicao.salvamentoPendenteEm !== null && edicao.salvamentoPendenteEm <= destino) {
        this.relogio.instante = edicao.salvamentoPendenteEm
        this._salvarVersao(edicao)
      }
    }
    this.relogio.instante = destino
  }

  // ---------- usuários ----------

  autenticar (nome, papel) {
    this.usuarioAtual = { nome, papel }
  }

  _exigirPapel (papel, mensagem) {
    if (!this.usuarioAtual || this.usuarioAtual.papel !== papel) throw new ErroDeRegra(mensagem)
  }

  // Executa uma ação como outra pessoa e volta ao usuário atual (usado para preparar cenários).
  _comoUsuario (nome, papel, acao) {
    const anterior = this.usuarioAtual
    this.autenticar(nome, papel)
    try {
      return acao()
    } finally {
      this.usuarioAtual = anterior
    }
  }

  // ---------- RN01: rascunho e versões ----------

  criarEdicao (titulo, autor) {
    return {
      titulo,
      autor,
      estado: ESTADO.RASCUNHO, // toda edição nasce como rascunho
      texto: '',
      versoes: [],
      ultimoNumeroDeVersao: 0,
      salvamentoPendenteEm: null,
      comentarios: [],
      disparo: null
    }
  }

  escrever (edicao, texto) {
    edicao.texto = texto
    if (edicao.salvamentoPendenteEm === null) {
      edicao.salvamentoPendenteEm = this.relogio.instante + INTERVALO_SALVAMENTO
    }
  }

  _salvarVersao (edicao) {
    edicao.ultimoNumeroDeVersao += 1
    edicao.versoes.push({
      numero: edicao.ultimoNumeroDeVersao,
      texto: edicao.texto,
      salvaEm: this.agora()
    })
    if (edicao.versoes.length > MAX_VERSOES) edicao.versoes.shift()
    edicao.salvamentoPendenteEm = null
  }

  restaurarVersao (edicao, numero) {
    const versao = edicao.versoes.find(v => v.numero === numero)
    if (!versao) throw new ErroDeRegra(`A versão ${numero} não está mais disponível`)
    // Restaurar é uma nova alteração do texto: as versões seguintes continuam no histórico.
    this.escrever(edicao, versao.texto)
    return `Versão ${numero} restaurada`
  }

  // ---------- RN02: aprovação ----------

  enviarParaRevisao (edicao) {
    edicao.estado = ESTADO.REVISAO
  }

  aprovar (edicao) {
    this._exigirPapel('revisor', 'Somente revisores podem aprovar edições')
    if (this.usuarioAtual.nome === edicao.autor) {
      throw new ErroDeRegra('O autor não pode aprovar a própria edição')
    }
    if (edicao.estado !== ESTADO.REVISAO) {
      throw new ErroDeRegra('Somente edições em revisão podem ser aprovadas')
    }
    edicao.estado = ESTADO.APROVADA
    edicao.aprovadaPor = this.usuarioAtual.nome
    return 'Edição aprovada'
  }

  reprovar (edicao, comentario) {
    this._exigirPapel('revisor', 'Somente revisores podem reprovar edições')
    if (!comentario || !comentario.trim()) {
      throw new ErroDeRegra('A reprovação exige um comentário')
    }
    edicao.estado = ESTADO.RASCUNHO
    edicao.comentarios.push({ autor: this.usuarioAtual.nome, texto: comentario })
    return 'Edição devolvida ao rascunho'
  }

  // Prepara, pelo caminho normal, uma edição escrita por Ana e aprovada por Bruno.
  prepararEdicaoAprovada (titulo) {
    const edicao = this.criarEdicao(titulo, 'Ana')
    this.enviarParaRevisao(edicao)
    this._comoUsuario('Bruno', 'revisor', () => this.aprovar(edicao))
    return edicao
  }

  // ---------- RN04: segmentos ----------

  criarSegmento (nome, quantidade) {
    const assinantes = []
    for (let i = 0; i < quantidade; i++) assinantes.push(this.proximoAssinante++)
    this.segmentos.set(nome, assinantes)
  }

  // Faz `quantidade` assinantes do segmento A também pertencerem ao segmento B (B mantém o tamanho).
  compartilharAssinantes (quantidade, nomeA, nomeB) {
    const a = this.segmentos.get(nomeA)
    const b = this.segmentos.get(nomeB)
    for (let i = 0; i < quantidade; i++) b[i] = a[i]
  }

  // ---------- RN03 + RN04: agendamento ----------

  _validarAntecedencia (horario) {
    if (horario.getTime() - this.relogio.instante < ANTECEDENCIA_MINIMA) {
      throw new ErroDeRegra('O envio precisa de ao menos 15 minutos de antecedência')
    }
  }

  agendar (edicao, nomesDosSegmentos, horario) {
    this._exigirPapel('gestor', 'Somente gestores podem agendar envios')
    if (edicao.estado !== ESTADO.APROVADA) {
      throw new ErroDeRegra('A edição precisa ser aprovada antes do envio')
    }
    if (nomesDosSegmentos.length === 0) throw new ErroDeRegra('Escolha ao menos um segmento')
    if (nomesDosSegmentos.length > MAX_SEGMENTOS) {
      throw new ErroDeRegra('Uma edição pode ir para no máximo 5 segmentos')
    }
    const destinatarios = new Set()
    for (const nome of nomesDosSegmentos) {
      const assinantes = this.segmentos.get(nome)
      if (!assinantes) throw new ErroDeRegra(`Segmento inexistente: ${nome}`)
      if (assinantes.length === 0) throw new ErroDeRegra(`Segmento sem assinantes: ${nome}`)
      assinantes.forEach(id => destinatarios.add(id)) // quem está em dois segmentos entra uma vez
    }
    this._validarAntecedencia(horario)

    edicao.disparo = {
      horario,
      segmentos: [...nomesDosSegmentos],
      destinatarios: [...destinatarios],
      reagendamentos: 0
    }
    edicao.estado = ESTADO.AGENDADA
    return 'Envio agendado'
  }

  reagendar (edicao, novoHorario) {
    this._exigirPapel('gestor', 'Somente gestores podem reagendar envios')
    if (!edicao.disparo) throw new ErroDeRegra('Não há envio agendado')
    if (edicao.disparo.reagendamentos >= MAX_REAGENDAMENTOS) {
      throw new ErroDeRegra('Limite de 2 reagendamentos atingido')
    }
    this._validarAntecedencia(novoHorario)
    edicao.disparo.horario = novoHorario
    edicao.disparo.reagendamentos += 1
    return 'Envio reagendado'
  }

  cancelar (edicao) {
    this._exigirPapel('gestor', 'Somente gestores podem cancelar envios')
    if (!edicao.disparo) throw new ErroDeRegra('Não há envio agendado')
    if (edicao.disparo.horario.getTime() - this.relogio.instante < PRAZO_CANCELAMENTO) {
      throw new ErroDeRegra('O envio só pode ser cancelado até 5 minutos antes do horário')
    }
    edicao.disparo = null
    edicao.estado = ESTADO.APROVADA
    return 'Envio cancelado'
  }
}

module.exports = { Servico, ErroDeRegra, ESTADO, SEGUNDO, MINUTO }
