import { SellingPriceCalculator } from '../components/SellingPriceCalculator.js';
const InsertButton = document.getElementById('insert');
const Action = document.getElementById('action')
const Id = document.getElementById('id')
const form = document.getElementById('form');
const totalTax = document.getElementById('total_imposto');
$(document).ready(function(){
  $("#preco_venda").maskMoney({
    prefix:'R$ ',
    allowNegative: true,
    thousands:'.',
    decimal:',',
    affixesStay: true
  });
});

$(document).ready(function(){
  $("#preco_compra").maskMoney({
    prefix:'R$ ',
    allowNegative: true,
    thousands:'.',
    decimal:',',
    affixesStay: true
  });
});
$(document).ready(function(){
  $("#custo_operacional").maskMoney({
    prefix:'% ',
    allowNegative: true,
    thousands:'.',
    decimal:',',
    affixesStay: true
  });
});
$(document).ready(function(){
  $("#margem_lucro").maskMoney({
    prefix:'% ',
    allowNegative: true,
    thousands:'.',
    decimal:',',
    affixesStay: true
  });
});
$(document).ready(function(){
  $("#total_imposto").maskMoney({
    prefix:'% ',
    allowNegative: true,
    thousands:'.',
    decimal:',',
    affixesStay: true
  });
});

totalTax.addEventListener('keypress', () => {
    const tax = String(totalTax.value).replace('%', '').replace(',', '.');
    const result = SellingPriceCalculator.create()
        .addTotalTax(tax)
        .getData();
        document.getElementById('total_imposto_value')
});


(async () => {
    const editData = await api.temp.get('product:edit');
    if (editData) {
        // Modo edição
        Action.value = editData.action || 'e';
        Id.value = editData.id || '';
        // Preenche todos os campos pelo atributo name
        for (const [key, value] of Object.entries(editData)) {
            const field = form.querySelector(`[name="${key}"]`);

            if (!field) continue;

            if (field.type === 'checkbox') {
                field.checked = value === true || value === 'true';
            } else {
                field.value = value || '';
            }
        }
    } else {
        Action.value = 'c';
        Id.value = '';
    }
})();


InsertButton.addEventListener('click', async () => {
    let timer = 3000;
    $('#insert').prop('disabled', true);

    const precoVendaLimpo = $("#preco_venda").maskMoney('unmasked')[0];
    const precoCompraLimpo = $("#preco_compra").maskMoney('unmasked')[0];
    const margemLucroLimpa = $("#margem_lucro").maskMoney('unmasked')[0];
    const custoOperacionalLimpo = $("#custo_operacional").maskMoney('unmasked')[0];
    const totalImpostosLimpo = $("#total_imposto").maskMoney('unmasked')[0];

    const data = formToJson(form);

    data.preco_venda = precoVendaLimpo;
    data.preco_compra = precoCompraLimpo;
    data.margem_lucro = margemLucroLimpa;
    data.custo_operacional = custoOperacionalLimpo;
    data.total_impostos = totalImpostosLimpo;

    let id = Action.value !== 'c' ? Id.value : null;

    try {
        const response = Action.value === 'c'
            ? await api.product.insert(data)
            : await api.product.update(id, data);

        if (!response.status) {
            toast('error', 'Erro', response.msg, timer);
            return;
        }
        toast('success', 'Sucesso', response.msg, timer);
        form.reset();
        setTimeout(() => {
            api.window.close();
        }, timer);

    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message, timer);
    } finally {
        $('#insert').prop('disabled', false);
    }
});