import {Datatables} from "../components/Datatables.js"

api.customer.onReload(() => {
    $('#table-customers').DataTable().ajax.reload(null, false);
});

Datatables.SetTable('#table-customers', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'cpf' },
    { data: 'rg' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editCustomer(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteCustomer(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.customer.find(filter));

async function deleteCustomer(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.customer.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-customers').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editUsers(id) {
    try {
        // 1. Busca os dados completos do cliente
        const customer = await api.customer.findById(id);
        if (!customer) {
            toast('error', 'Erro', 'Cliente não encontrado.');
            return;
        }
        // 2. Salva no temp store com a ação 'e' (editar)
        await api.temp.set('customer:edit', {
            action: 'e',
            ...customer,
        });
        // 3. Abre a modal
        api.window.openModal('pages/customer', {
            width: 600,
            height: 500,
            title: 'Editar Cliente',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}
window.deleteCustomer = deleteCustomer;
window.editCustomer = editCustomer;