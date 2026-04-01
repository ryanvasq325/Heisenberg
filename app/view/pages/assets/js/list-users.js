import {Datatables} from "../components/Datatables.js"

api.users.onReload(() => {
    $('#table-users').DataTable().ajax.reload(null, false);
});

Datatables.SetTable('#table-users', [
    { data: 'id' },
    { data: 'nome' },
    { data: 'sobrenome' },
    { data: 'cpf' },
    { data: 'rg' },
    { data: 'ativo' },
    {
        data: null,
        orderable: false,
        searchable: false,
        render: function (row) {
            return `
                <button onclick="editUsers(${row.id})" class="btn btn-xs btn-warning btn-sm">
                    <i class="fa-solid fa-pen-to-square"></i> Editar
                </button>
                <button onclick="deleteUsers(${row.id})" class="btn btn-xs btn-danger btn-sm">
                    <i class="fa-solid fa-trash"></i> Excluir
                </button>
            `;
        }
    }
]).getData(filter => api.users.find(filter));

async function deleteUsers(id) {
    const result = await Swal.fire({
        title: 'Tem certeza?',
        text: 'Esta ação não pode ser desfeita.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
        const response = await api.users.delete(id);

        if (response.status) {
            toast('success', 'Excluído', response.msg);
            $('#table-users').DataTable().ajax.reload();
        } else {
            toast('error', 'Erro', response.msg);
        }
    }
}

async function editUsers(id) {
    try {
        // 1. Busca os dados completos do Usuario
        const users = await api.users.findById(id);
        if (!users) {
            toast('error', 'Erro', 'Usuario não encontrado.');
            return;
        }
        // 2. Salva no temp store com a ação 'e' (editar)
        await api.temp.set('users:edit', {
            action: 'e',
            ...users,
        });
        // 3. Abre a modal
        api.window.openModal('pages/users', {
            width: 600,
            height: 500,
            title: 'Editar Usuario',
        });
    } catch (err) {
        toast('error', 'Falha', 'Erro: ' + err.message);
    }
}
window.deleteUsers = deleteUsers;
window.editUsers = editUsers;