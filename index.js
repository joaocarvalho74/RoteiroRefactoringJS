const { readFileSync } = require('fs');

class Repositorio {
    constructor() {
        this.pecas = JSON.parse(readFileSync('./pecas.json'));
    }

    getPeca(apre) {
        return this.pecas[apre.id];
    }
}

class ServicoCalculoFatura {
    constructor(repo) {
        this.repo = repo;
    }

    calcularTotalApresentacao(apre) {
        let total = 0;
        switch (this.repo.getPeca(apre).tipo) {
            case "tragedia":
                total = 40000;
                if (apre.audiencia > 30) {
                    total += 1000 * (apre.audiencia - 30);
                }
                break;
            case "comedia":
                total = 30000;
                if (apre.audiencia > 20) {
                    total += 10000 + 500 * (apre.audiencia - 20);
                }
                total += 300 * apre.audiencia;
                break;
            default:
                throw new Error(`Peça desconhecida: ${this.repo.getPeca(apre).tipo}`);
        }
        return total;
    }

    calcularCredito(apre) {
        let creditos = Math.max(apre.audiencia - 30, 0);
        if (this.repo.getPeca(apre).tipo === "comedia") {
            creditos += Math.floor(apre.audiencia / 5);
        }
        return creditos;
    }

    calcularTotalFatura(fatura) {
        return fatura.apresentacoes.reduce((total, apre) => total + this.calcularTotalApresentacao(apre), 0);
    }

    calcularTotalCreditos(fatura) {
        return fatura.apresentacoes.reduce((total, apre) => total + this.calcularCredito(apre), 0);
    }
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2
    }).format(valor / 100);
}

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

const faturas = JSON.parse(readFileSync('./faturas.json'));
const repo = new Repositorio();
const calc = new ServicoCalculoFatura(repo);

const faturaStr = gerarFaturaStr(faturas, calc);
console.log(faturaStr);

const faturaHTML = gerarFaturaHTML(faturas, calc);
console.log(faturaHTML);
