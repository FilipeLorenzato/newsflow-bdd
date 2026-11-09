// Configuração do Cucumber.js: onde está o código e quais relatórios gerar.
module.exports = {
  default: {
    require: ['features/support/**/*.js', 'features/step_definitions/**/*.js'],
    format: ['progress', 'html:relatorios/cucumber-report.html'],
    publish: false
  }
}
