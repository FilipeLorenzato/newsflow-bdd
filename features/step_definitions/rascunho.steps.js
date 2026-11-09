// US01 — Salvar rascunho automaticamente (RN01)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que escrevi {string} na edição', function (texto) {
  this.servico.escrever(this.edicao, texto)
})

// Gera N versões pelo caminho real: escreve e espera o salvamento automático, N vezes.
Given('que a edição já tem {int} versões salvas', function (quantidade) {
  for (let n = 1; n <= quantidade; n++) {
    this.servico.escrever(this.edicao, `Texto da versão ${n}`)
    this.avancarSegundos(30)
  }
})

When('fico {int} segundos sem digitar', function (segundos) {
  this.avancarSegundos(segundos)
})

When('restauro a versão {int}', function (numero) {
  this.executar(() => this.servico.restaurarVersao(this.edicao, numero))
})

Then('a quantidade de versões salvas deve ser {int}', function (quantidade) {
  assert.equal(this.edicao.versoes.length, quantidade)
})

Then('a versão {int} deve conter o texto {string}', function (numero, texto) {
  const versao = this.edicao.versoes.find(v => v.numero === numero)
  assert.ok(versao, `A versão ${numero} não existe`)
  assert.equal(versao.texto, texto)
})

Then('a versão mais antiga disponível deve ser a {int}', function (numero) {
  assert.equal(this.edicao.versoes[0].numero, numero)
})

Then('o texto atual da edição deve ser {string}', function (texto) {
  assert.equal(this.edicao.texto, texto)
})
