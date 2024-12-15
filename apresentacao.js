const formatarMoeda = require('./util.js');

function gerarFaturaStr(fatura, calc) {
    let faturaStr = `Fatura ${fatura.cliente}\n`;
    for (let apre of fatura.apresentacoes) {
        faturaStr += `  ${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)\n`;
    }
    faturaStr += `Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))}\n`;
    faturaStr += `Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} \n`;
    return faturaStr;
}

function gerarFaturaHTML(fatura, calc) {
    let faturaHTML = `<html>\n<p> Fatura ${fatura.cliente} </p>\n<ul>\n`;
    for (let apre of fatura.apresentacoes) {
        faturaHTML += `  <li>${calc.repo.getPeca(apre).nome}: ${formatarMoeda(calc.calcularTotalApresentacao(apre))} (${apre.audiencia} assentos)</li>\n`;
    }
    faturaHTML += `</ul>\n<p> Valor total: ${formatarMoeda(calc.calcularTotalFatura(fatura))} </p>\n`;
    faturaHTML += `<p> Créditos acumulados: ${calc.calcularTotalCreditos(fatura)} </p>\n</html>`;
    return faturaHTML;
}

module.exports = { gerarFaturaStr, gerarFaturaHTML };
