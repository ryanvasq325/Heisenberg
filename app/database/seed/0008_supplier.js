import { faker } from "@faker-js/faker/locale/pt_BR";

export async function seed(knex) {
    await knex('supplier').del();

    const batchSize = 1000;
    const total = 10000;

    for (let i = 0; i < total; i += batchSize) {
        const batch = Array.from({ length: batchSize }, () => ({
            nome_fantasia: faker.company.name(),
            razao_social: faker.company.name() + " LTDA",
            cnpj_cpf: faker.helpers.replaceSymbols('##.###.###/0001-##'), 
            rg_ie: faker.string.numeric(9), 
            ativo: faker.datatype.boolean(),
        }));
        
        await knex('supplier').insert(batch);
    }
};
