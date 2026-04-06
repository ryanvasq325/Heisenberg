function calcularPrecoVenda(custoInicial, margemLucroDesejada, custoOperacionalPercentual) {
    const icms = 0.195;  // 19,5%
    const pis = 0.0165;  // 1,65%
    const cofins = 0.076; // 7,6%
    const ipi = 0;        // 0%

    const somaImpostos = icms + pis + cofins + ipi;
    const divisor = 1 - somaImpostos;

    const valorComImposto = custoInicial / divisor;
    const totalImposto = valorComImposto - custoInicial;

    const valorLucro = custoInicial * (margemLucroDesejada / 100);
    const valorCustoOperacional = custoInicial * (custoOperacionalPercentual / 100);

    const precoVendaFinal = custoInicial + totalImposto + valorLucro + valorCustoOperacional;

    return {
        valorComImposto: valorComImposto.toFixed(2),
        totalImposto: totalImposto.toFixed(2),
        valorLucro: valorLucro.toFixed(2),
        valorCustoOperacional: valorCustoOperacional.toFixed(2),
        precoVendaFinal: precoVendaFinal.toFixed(2)
    };
}

const resultado = calcularPrecoVenda(300, 20, 2);
console.log(resultado);