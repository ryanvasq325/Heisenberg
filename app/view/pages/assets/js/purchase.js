'use strict';

let rowCount = 0;
const rows = {}; 
let produtos = [];

// Função utilitária para converter strings de moeda (R$ 1.000,00) em Float
function parseValue(val) {
    if (!val) return 0;
    return parseFloat(
        String(val)
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
    ) || 0;
}

// Formatação visual
function fmt(v) {
    return 'R$ ' + parseFloat(v || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

document.addEventListener('DOMContentLoaded', () => {
    carregarFornecedores();
    carregarProdutos();
    adicionarItem(); // Começa com uma linha limpa

    document.getElementById('estado_compra').addEventListener('change', atualizarBadge);
    document.getElementById('btn-add-item').addEventListener('click', adicionarItem);
    document.getElementById('btn-salvar').addEventListener('click', salvar);

    // Listener global único para fechar listas de busca ao clicar fora
    document.addEventListener('click', (e) => {
        document.querySelectorAll('[id^="produto-lista-"]').forEach(lista => {
            const id = lista.id.split('-').pop();
            const input = document.getElementById('produto-nome-' + id);
            if (lista && input && !lista.contains(e.target) && e.target !== input) {
                lista.style.display = 'none';
            }
        });
    });
});

async function carregarFornecedores() {
    try {
        const lista = await api.supplier.getAll();
        const select = document.getElementById('id_fornecedor');
        lista.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.textContent = f.nome_fantasia || f.razao_social;
            select.appendChild(opt);
        });
    } catch (err) {
        console.error('Erro ao carregar fornecedores:', err);
    }
}

async function carregarProdutos() {
    try {
        produtos = await api.product.getAll();
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}

function atualizarBadge() {
    const estado = document.getElementById('estado_compra').value;
    const badge = document.getElementById('badge-estado');
    if (estado === 'RECEBIDO') {
        badge.textContent = 'Recebido';
        badge.className = 'badge bg-success';
    } else {
        badge.textContent = 'Em andamento';
        badge.className = 'badge bg-warning text-dark';
    }
}

function calcRow(id) {
    const qty   = parseFloat(document.getElementById(`qty-${id}`).value) || 0;
    const bruto = parseValue(document.getElementById(`bruto-${id}`).value);
    const desc  = parseValue(document.getElementById(`desc-${id}`).value);
    const acres = parseValue(document.getElementById(`acres-${id}`).value);
    
    // Cálculo: (Preço Unitário * Qtd) - Desconto + Acréscimo
    const totalItemBruto = bruto * qty;
    const liq = totalItemBruto - desc + acres;
    
    // Atualiza o campo líquido (formatado)
    document.getElementById(`liq-${id}`).value = liq.toFixed(2);
    
    // Armazena os valores para o total geral
    rows[id] = { bruto: totalItemBruto, desc, acres, liq };
    calcTotals();
}

function calcTotals() {
    let tb = 0, td = 0, ta = 0, tl = 0;
    Object.values(rows).forEach(r => {
        tb += r.bruto;
        td += r.desc;
        ta += r.acres;
        tl += r.liq;
    });
    
    document.getElementById('tot-bruto').textContent = fmt(tb);
    document.getElementById('tot-desc').textContent  = fmt(td);
    document.getElementById('tot-acres').textContent = fmt(ta);
    document.getElementById('tot-liq').textContent   = fmt(tl);
}

function removerItem(id) {
    const el = document.getElementById('row-' + id);
    if (el) {
        el.remove();
        delete rows[id];
        calcTotals();
    }
}

function adicionarItem() {
    rowCount++;
    const id = rowCount;
    rows[id] = { bruto: 0, desc: 0, acres: 0, liq: 0 };

    const tr = document.createElement('tr');
    tr.id = 'row-' + id;
    tr.innerHTML = `
        <td style="position:relative">
            <input type="hidden" id="produto-id-${id}">
            <input type="text" class="form-control form-control-sm" id="produto-nome-${id}"
                placeholder="Buscar produto..." autocomplete="off" oninput="filtrarProdutos(${id})">
            <ul class="list-group shadow" id="produto-lista-${id}" 
                style="display:none; position:absolute; z-index:999; width:100%; max-height:180px; overflow-y:auto; top:100%; left:0"></ul>
        </td>
        <td><input type="number" class="form-control form-control-sm" value="1" min="0" step="0.0001" id="qty-${id}" oninput="calcRow(${id})"></td>
        <td><input type="text" class="form-control form-control-sm money" id="bruto-${id}" oninput="calcRow(${id})"></td>
        <td><input type="text" class="form-control form-control-sm money" id="desc-${id}" oninput="calcRow(${id})"></td>
        <td><input type="text" class="form-control form-control-sm money" id="acres-${id}" oninput="calcRow(${id})"></td>
        <td><input type="text" class="form-control form-control-sm" id="liq-${id}" readonly style="background-color:#f8f9fa"></td>
        <td class="text-center">
            <button class="btn btn-outline-danger btn-sm" onclick="removerItem(${id})">&times;</button>
        </td>
    `;
    document.getElementById('itens-body').appendChild(tr);

    // Aplica a máscara de moeda se você estiver usando Inputmask
    if (typeof Inputmask !== "undefined") {
        Inputmask("currency", {
            radixPoint: ",",
            groupSeparator: ".",
            prefix: "R$ ",
            autoGroup: true,
            rightAlign: false
        }).mask(`#bruto-${id}, #desc-${id}, #acres-${id}`);
    }
}

function filtrarProdutos(id) {
    const termo = document.getElementById('produto-nome-' + id).value.toLowerCase();
    const lista = document.getElementById('produto-lista-' + id);

    if (termo.length < 2) {
        lista.style.display = 'none';
        return;
    }

    const filtrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(termo)
    ).slice(0, 10);

    lista.innerHTML = '';

    if (filtrados.length === 0) {
        lista.innerHTML = '<li class="list-group-item text-muted small">Nenhum produto encontrado</li>';
        lista.style.display = 'block';
        return;
    }

    filtrados.forEach(p => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action small';
        li.textContent = p.nome;
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => selecionarProduto(id, p));
        lista.appendChild(li);
    });

    lista.style.display = 'block';
}

function selecionarProduto(id, produto) {
    document.getElementById('produto-id-' + id).value   = produto.id;
    document.getElementById('produto-nome-' + id).value = produto.nome;
    document.getElementById('produto-lista-' + id).style.display = 'none';

    if (produto.preco_custo) {
        // Preenche o valor bruto com o preço de custo do cadastro
        document.getElementById('bruto-' + id).value = parseFloat(produto.preco_custo).toFixed(2);
        calcRow(id);
    }
}

async function salvar() {
    const id_fornecedor  = document.getElementById('id_fornecedor').value;
    const estado_compra  = document.getElementById('estado_compra').value;
    const observacao     = document.getElementById('observacao').value;
    const action         = document.getElementById('action').value;
    const purchaseId     = document.getElementById('id').value;

    if (!id_fornecedor) {
        alert('Selecione um fornecedor.');
        return;
    }


    const itens = Object.keys(rows).map(id => ({
        id_produto : document.getElementById('produto-id-' + id).value || null,
        produto    : document.getElementById('produto-nome-' + id).value,
        quantidade : parseFloat(document.getElementById('qty-' + id).value) || 0,
        valor_unit : parseValue(document.getElementById('bruto-' + id).value),
        desconto   : rows[id].desc,
        acrescimo  : rows[id].acres,
        total_liq  : rows[id].liq,
    })).filter(i => i.produto.trim() !== "");

    if (itens.length === 0) {
        alert('Adicione pelo menos um item válido.');
        return;
    }

    const compra = {
        id_fornecedor,
        estado_compra,
        observacao,
        total_geral: parseValue(document.getElementById('tot-liq').textContent),
        itens,
    };

    try {
        let response;
        if (action === 'update' && purchaseId) {
            response = await api.purchase.update(purchaseId, compra);
        } else {
            response = await api.purchase.insert(compra);
        }

        alert('Compra salva com sucesso!');
        api.window.close();
    } catch (err) {
        console.error('Erro ao salvar compra:', err);
        alert('Erro ao salvar compra.');
    }
}