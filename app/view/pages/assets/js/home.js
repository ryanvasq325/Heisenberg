 async function refreshDashboard() {
        try {
            
            const stats = await api.dashboard.getStats();
            
            console.log("Dados recebidos:", stats); 

            const prodElem = document.getElementById('count-products');
            const custElem = document.getElementById('count-customers');
            const useElem = document.getElementById('count-users');
            const enterElem = document.getElementById('count-enterprises');
            const fornElem = document.getElementById('count-suppliers');

            
            if (stats) {
                if (prodElem) prodElem.innerText = stats.totalProducts ?? 0;
                if (custElem) custElem.innerText = stats.totalCustomers ?? 0;
                if (useElem) useElem.innerText = stats.totalUsers ?? 0;
                if (enterElem) enterElem.innerText = stats.totalEnterprises ?? 0;
                if (fornElem) fornElem.innerText = stats.totalSuppliers ?? 0;
            }
        } catch (err) {
            console.error("Erro ao atualizar dashboard:", err);

            document.getElementById('count-products').innerText = "0";
            document.getElementById('count-customers').innerText = "0";
            document.getElementById('count-users').innerText = "0";
            document.getElementById('count-enterprises').innerText = "0";
            document.getElementById('count-suppliers').innerText = "0";
        }
    }
    
    window.addEventListener('DOMContentLoaded', refreshDashboard);

    api.product.onReload(refreshDashboard);
    api.customer.onReload(refreshDashboard);
    api.users.onReload(refreshDashboard);
    api.enterprise.onReload(refreshDashboard);
    api.supplier.onReload(refreshDashboard);