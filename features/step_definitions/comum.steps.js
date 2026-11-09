// Passos compartilhados por mais de uma funcionalidade.
const { Given, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que estou autenticado/autenticada como {word} {string}', function (papel, nome) {
  this.servico.autenticar(nome, this.papel(papel))
})

Given('que existe a edição {string} em rascunho', function (titulo) {
  const autor = this.servico.usuarioAtual.nome
  this.edicao = this.servico.criarEdicao(titulo, autor)
})

Given('que existe a edição {string} aprovada', function (titulo) {
  this.edicao = this.servico.prepararEdicaoAprovada(titulo)
})

Then('devo ver a mensagem {string}', function (esperada) {
  assert.ok(this.resultado, 'Nenhuma ação foi executada no cenário')
  assert.equal(this.resultado.mensagem, esperada)
})

Then('a edição deve estar/continuar {string}', function (estado) {
  assert.equal(this.edicao.estado, estado)
})
