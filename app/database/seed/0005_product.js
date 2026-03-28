const { faker } = require("@faker-js/faker");

exports.seed = async function (knex) {
    await knex('product').del();

    const batchSize = 1000;

    const total = 1000000;

    const unidades = ['UN', 'KG', 'G', 'LT', 'ML', 'CX', 'PC', 'FD'];
    for (let i = 0; i < total; i += batchSize) {
        const batch = Array.from({ length: batchSize }, () => ({
            nome: faker.commerce.product(),
            codigo_barra: faker.commerce.upc(),
            unidade: faker.helpers.arrayElement(unidades),
            preco_compra: faker.commerce.price({ min: 20, max: 150 }),
            margem_lucro: faker.commerce.price({ min: 20, max: 30 }),
            preco_venda: faker.commerce.price({ min: 155, max: 400 }),
            descricao: faker.commerce.productDescription(),
            ativo: faker.datatype.boolean(),
        }));
        await knex('product').insert(batch);
    }
};