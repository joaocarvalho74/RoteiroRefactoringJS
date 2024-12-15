const { readFileSync } = require('fs');
const Repositorio = require('./repositorio.js');
const ServicoCalculoFatura = require('./servico.js');
const { gerarFaturaStr, gerarFaturaHTML } = require('./apresentacao.js');

const faturas = JSON.parse(readFileSync('./faturas.json'));
const repo = new Repositorio();
const calc = new ServicoCalculoFatura(repo);

const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);
