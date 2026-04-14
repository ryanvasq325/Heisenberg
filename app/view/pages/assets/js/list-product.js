import { Datatables } from "../components/Datatables.js"

api.product.onReload(() => {
    $('#table-products').DataTable().ajax.reload(null, false);
});

Datatables.SetTable('#table-products', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'codigo_barra' },
    { data: 'unidade' },
    {
        data: 'preco_compra',
        render: function (data) {
            return parseFloat(data).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    },
    {
        data: 'preco_venda',
        render: function (data) {
            return parseFloat(data).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    },
    {
        data: 'ativo',
        render: function (data) {
            return data
                ? `<span>Ativo <i class="fa-regular fa-square-check"></i></span>`
                : `<span>Inativo <i class="fa-regular fa-square-full"></i></span>`;
        }
    },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editProduct(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteProduct(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
                <button onclick="printProduct(${row.id})" class="btn btn-xs btn-info btn-sm">
                    <i class="fa-solid fa-print"></i> Imprimir
                </button>
            `;
        }
    }
]).getData(filter => api.product.find(filter));

async function deleteProduct(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.product.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-products').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editProduct(id) {
    try {
        const product = await api.product.findById(id);
        if (!product) {
            toast('error', 'Erro', 'Produto não encontrado.');
            return;
        }

        await api.temp.set('product:edit', {
            action: 'e',
            ...product,
        });

        api.window.openModal('pages/product', {
            width: 800,
            height: 420,
            title: 'Editar Produto',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}
async function printProduct(id) {
    try {
        // 1. Busca os dados completos do produto
        const product = await api.product.findById(id);
        if (!product) {
            toast('error', 'Erro', 'Produto não encontrado.');
            return;
        }
        api.print.stringHTML(`
            <h1>Ficha do Produto</h1>
            <p><strong>ID:</strong> ${product.id}</p>
            <p><strong>Nome:</strong> ${product.nome}</p>
            <p><strong>Código de Barra:</strong> ${product.codigo_barra}</p>
        `).destino(`product_${product.id}.pdf`).print().then(result => {
            if (result.sucesso) {
                toast('success', 'Sucesso', 'PDF gerado em: ' + result.caminho);
            } else {
                toast('error', 'Erro', 'Falha ao gerar PDF.');
            }
        }).catch(err => {
            toast('error', 'Erro', 'Erro: ' + err.message);
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}
window.printProduct = printProduct;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;