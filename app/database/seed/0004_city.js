//Link da API das Cidade.
const URL_CIDADE = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados/';
exports.seed = async function (knex) {
    //Limpa a tabela de cidades
    await knex('city').del();
    const UFs = await knex('federative_unit').select('id', 'codigo');
    if (UFs.length <= 0) {
        throw new Error("Restrição: Não existem estado cadastro!");
    }
    for (const uf of UFs) {
        const URL_MUNICIPIO_POR_ESTADO = URL_CIDADE + uf.codigo + '/municipios';
        const response = await fetch(URL_MUNICIPIO_POR_ESTADO);
        const cidades = await response.json();
        const data = cidades.map((cidade) => ({
            id_uf: uf.id,
            codigo: cidade?.id,
            nome: cidade?.nome
        }));
        await knex('city').insert(data);
    };
};