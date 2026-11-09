// US03 — Agendar envio (RN03) e US04 — Escolher os segmentos (RN04)
const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

// ---------- contexto ----------

Given('que agora é {datahora}', function (data) {
  this.servico.definirAgora(data)
})

Given('que o segmento {string} tem {int} assinantes', function (nome, quantidade) {
  this.servico.criarSegmento(nome, quantidade)
})

Given('que {int} assinantes estão tanto em {string} quanto em {string}', function (quantidade, a, b) {
  this.servico.compartilharAssinantes(quantidade, a, b)
})

Given('que existem {int} segmentos com {int} assinantes cada', function (segmentos, assinantes) {
  this.nomesDosSegmentos = []
  for (let i = 1; i <= segmentos; i++) {
    const nome = `Segmento ${i}`
    this.servico.criarSegmento(nome, assinantes)
    this.nomesDosSegmentos.push(nome)
  }
})

Given('que o envio está agendado para daqui a {int} minutos', function (minutos) {
  this.servico.agendar(this.edicao, ['Clientes Premium'], this.daquiA(minutos))
})

// Faz os reagendamentos de verdade, cada um para 60 minutos à frente.
Given('que o total de reagendamentos já feitos é {int}', function (vezes) {
  for (let i = 0; i < vezes; i++) this.servico.reagendar(this.edicao, this.daquiA(60))
})

// Agenda com 30 minutos de antecedência e deixa o relógio correr até faltar o tempo pedido.
Given('que faltam {int} minutos para o envio agendado', function (minutos) {
  this.servico.agendar(this.edicao, ['Clientes Premium'], this.daquiA(30))
  this.avancarMinutos(30 - minutos)
})

// ---------- ações ----------

When('agendo o envio para o segmento {string} daqui a {int} minutos', function (segmento, minutos) {
  this.executar(() => this.servico.agendar(this.edicao, [segmento], this.daquiA(minutos)))
})

When('agendo o envio para os segmentos {string} e {string} daqui a {int} minutos', function (a, b, minutos) {
  this.executar(() => this.servico.agendar(this.edicao, [a, b], this.daquiA(minutos)))
})

When('agendo o envio para {int} desses segmentos daqui a {int} minutos', function (quantidade, minutos) {
  const escolhidos = this.nomesDosSegmentos.slice(0, quantidade)
  this.executar(() => this.servico.agendar(this.edicao, escolhidos, this.daquiA(minutos)))
})

When('reagendo o envio para daqui a {int} minutos', function (minutos) {
  this.executar(() => this.servico.reagendar(this.edicao, this.daquiA(minutos)))
})

When('cancelo o envio', function () {
  this.executar(() => this.servico.cancelar(this.edicao))
})

// ---------- verificações ----------

Then('o disparo deve estar agendado para {datahora}', function (esperado) {
  assert.ok(this.edicao.disparo, 'Não há disparo agendado')
  assert.equal(this.edicao.disparo.horario.getTime(), esperado.getTime()) // compara instantes, não textos
})

Then('o disparo deve continuar agendado', function () {
  assert.ok(this.edicao.disparo, 'O disparo deveria continuar agendado')
  assert.equal(this.edicao.estado, 'agendada')
})

Then('o disparo não deve estar agendado', function () {
  assert.equal(this.edicao.disparo, null)
})

Then('o disparo deve ter {int} destinatários', function (quantidade) {
  assert.equal(this.edicao.disparo.destinatarios.length, quantidade)
})

Then('nenhum assinante deve receber a edição duas vezes', function () {
  const lista = this.edicao.disparo.destinatarios
  assert.equal(new Set(lista).size, lista.length)
})
