import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  const dados = {
    titulo: 'Relatório: 22 - Entradas de Estoque',
    filial: 'CRIVALE AUTO POSTO',
    dataRelatorio: '09/04/2026',
    totalGeral: '5.552,53',
    
    infoFornecedor: {
      nome: "BANANA CIA",
      cnpj: "38.542.481/0001-30",
      ie: "3531404691910-4",
      endereco: "Avenida Malaquita, Residencial Parque Alvorada, Cacoal",
      cep: "76961-619",
      contato: "(69) 2245-5226",
      responsavel: "Willian Booner Jr."
    },

    pagamento: {
      metodo: "Boleto Bancário",
      condicao: "30/60 dias",
      status: "Programado"
    },

    notasFiscais: [
      {
        numero: "476502",
        data: "09/04/2026",
        total: "3.396,34",
        itens: [
          { desc: "7957-STELLA ARPOTOIS PURE", qtd: "24,00", custo: "6,01", venda: "8,50", total: "144,12" },
          { desc: "9994-STELLA ARTOIS PURE", qtd: "32,00", custo: "3,88", venda: "6,00", total: "124,20" },
          { desc: "113-SKOL PALITO 269ml", qtd: "300,00", custo: "2,85", venda: "3,50", total: "853,82" },
          { desc: "5786-CERVEJA ORIGINAL LT", qtd: "150,00", custo: "3,39", venda: "4,00", total: "508,13" }
        ]
      },
      {
        numero: "476503",
        data: "09/04/2026",
        total: "402,80",
        itens: [
          { desc: "4547-GATORADE SABORES 500", qtd: "12,00", custo: "4,39", venda: "8,50", total: "52,66" },
          { desc: "12042-RED BULL SUGAR FREE", qtd: "4,00", custo: "6,26", venda: "12,50", total: "25,04" }
        ]
      }
    ]
  };

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="pt-br">
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <style>
      body { font-family: Arial, sans-serif; font-size: 11px; color: #333; }
      .container { padding: 20px; border: 1px solid #ddd; margin-top: 10px; background: #fff; }
      .header-box { border-bottom: 2px solid #333; margin-bottom: 20px; padding-bottom: 10px; }
      .info-card { background: #f8f9fa; border: 1px solid #dee2e6; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
      .payment-info { border-left: 5px solid #007bff; padding-left: 15px; }
      .table thead { background: #343a40; color: white; }
      .total-final { background: #28a745; color: white; font-size: 16px; font-weight: bold; padding: 15px; margin-top: 20px; border-radius: 4px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header-box text-center">
        <h2>${dados.titulo}</h2>
        <p>Filial: <strong>${dados.filial}</strong> | Data: ${dados.dataRelatorio}</p>
      </div>

      <div class="row">
        <div class="col-7">
          <div class="info-card">
            <h6>FORNECEDOR</h6>
            <strong>${dados.infoFornecedor.nome}</strong><br>
            CNPJ: ${dados.infoFornecedor.cnpj}<br>
            Endereço: ${dados.infoFornecedor.endereco}
          </div>
        </div>
        <div class="col-5">
          <div class="info-card payment-info">
            <h6>FORMA DE PAGAMENTO</h6>
            <strong>${dados.pagamento.metodo}</strong><br>
            Condição: ${dados.pagamento.condicao}<br>
            Status: ${dados.pagamento.status}
          </div>
        </div>
      </div>

      ${dados.notasFiscais.map(nota => `
        <div class="mt-4"><strong>NOTA FISCAL: ${nota.numero}</strong></div>
        <table class="table table-sm table-bordered">
          <thead>
            <tr>
              <th>Descrição</th>
              <th class="text-center">Qtd</th>
              <th class="text-right">Custo Un</th>
              <th class="text-right">Venda Un</th>
              <th class="text-right">Total Item</th>
            </tr>
          </thead>
          <tbody>
            ${nota.itens.map(item => `
              <tr>
                <td>${item.desc}</td>
                <td class="text-center">${item.qtd}</td>
                <td class="text-right">R$ ${item.custo}</td>
                <td class="text-right">R$ ${item.venda}</td>
                <td class="text-right">R$ ${item.total}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `).join('')}

      <div class="total-final text-right">
        TOTAL GERAL DO RELATÓRIO: R$ ${dados.totalGeral}
      </div>
    </div>
  </body>
  </html>`;

  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: 'Relatorio_Entradas_Corrigido.pdf',
    format: 'A4',
    margin: { top: '20px', bottom: '20px', left: '15px', right: '15px' }
  });

  await browser.close();
  console.log('PDF gerado com sucesso!');
})();