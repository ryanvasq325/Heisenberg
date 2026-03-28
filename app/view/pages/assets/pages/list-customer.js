api.customer.onReload(() => {
    $('#table-customers').DataTable().ajax.reload(null, false);
});

$('#table-customers').DataTable({
    paging: true,
    lengthChange: true,
    ordering: true,
    info: true,
    autoWidth: false,
    responsive: true,
    stateSave: true,
    select: true,
    searching: true,
    processing: true,
    serverSide: true,
    language: {
        url: 'https://cdn.datatables.net/plug-ins/2.3.6/i18n/pt-BR.json',
        searchPlaceholder: 'Digite sua pesquisa...'

    },
    ajax: async (data, callback) => {
        const filter = {
            draw: data.draw,
            term: data?.search?.value,      //Termo da pesquisa
            limit: data?.length,            //Limite de resgistos a ser selecionado do banco
            offset: data?.start,            //A pesquinsa inicia no registro Ex: 5, 10
            orderType: data.order[0]?.dir, //Tipo de ordenação 
            column: data.order[0]?.column  //Coluna a ser filtrada
        }
        try {
            const response = await api.customer.find(filter);
            callback(response);
        } catch (error) {
            callback({ draw: data?.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
        }
    },
    columns: [
        { data: 'id', title: 'Código' },
        { data: 'nome', title: 'Nome' },
        { data: 'cpf', title: 'CPF' },
        {
            data: null,
            title: 'Ações',
            orderable: false,
            searchable: false,
            render: function (data, type, row) {
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
    ],
    layout: {
        topStart: 'search',
        topEnd: 'pageLength',
        bottomStart: 'info',
        bottomEnd: 'paging'
    },
    // ✅ Aqui aplicamos a estilização após a tabela estar pronta
    initComplete: function () {
        setTimeout(() => {
            // Remove o label "Pesquisar"
            const label = document.querySelector('.dt-search label');
            if (label) {
                label.remove(); // Remove completamente do DOM
            }
            // Seleciona div que contém o campo de pesquisa
            const searchDiv = document.querySelector('.row > div.dt-layout-start');
            if (searchDiv) {
                searchDiv.classList.remove('col-md-auto');
                searchDiv.classList.add('col-lg-6', 'col-md-6', 'col-sm-12');
            }
            const divSearch = document.querySelector('.dt-search');
            if (divSearch) {
                divSearch.classList.add('w-100'); // ou w-100, w-75 etc.
            }

            const input = document.querySelector('#dt-search-0');
            if (input) {
                input.classList.remove('form-control-sm'); // ou w-100, w-75 etc.
                input.classList.add('form-control-md', 'w-100'); // ou w-100, w-75 etc.
                // Remove margem e padding da esquerda
                input.style.marginLeft = '0';
                input.focus();
            }
            const pageLength = document.querySelector('#dt-length-0');
            if (pageLength) {
                pageLength.classList.add('form-select-md'); // ou form-select-sm, dependendo do tamanho desejado
            }
        }, 100);
    }
});

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

async function editCustomer(id) {
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