import { faker } from "@faker-js/faker/locale/pt_BR";

export async function seed(knex) {
    await knex('enterprise').del();

    const batchSize = 1000;
    const total = 10000;

    for (let i = 0; i < total; i += batchSize) {
        const batch = Array.from({ length: batchSize }, () => ({
            fantasia: faker.company.name(),
            razao_social: faker.company.name() + " LTDA",
            cnpj: faker.helpers.replaceSymbols('##.###.###/0001-##'), 
            ie: faker.string.numeric(9), 
            ativo: faker.datatype.boolean(),
        }));
        
        await knex('enterprise').insert(batch);
    }
};
