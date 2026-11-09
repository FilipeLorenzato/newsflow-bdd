// US02 — Aprovar edição antes do envio (RN02)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que a edição {string} foi escrita pela/pelo redatora/redator {string}', function (titulo, autor) {
  this.edicao = this.servico.criarEdicao(titulo, autor)
})

Given('que ela foi enviada para revisão', function () {
  this.servico.enviarParaRevisao(this.edicao)
})

When('aprovo a edição', function () {
  this.executar(() => this.servico.aprovar(this.edicao))
})

When('reprovo a edição com o comentário {string}', function (comentario) {
  this.executar(() => this.servico.reprovar(this.edicao, comentario))
})

When('reprovo a edição sem comentário', function () {
  this.executar(() => this.servico.reprovar(this.edicao, ''))
})

Then('a edição deve ter o comentário {string}', function (texto) {
  const textos = this.edicao.comentarios.map(c => c.texto)
  assert.ok(textos.includes(texto), `Comentários registrados: ${JSON.stringify(textos)}`)
})
