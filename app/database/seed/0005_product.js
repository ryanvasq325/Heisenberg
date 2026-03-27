import { faker } from "@faker-js/faker/locale/pt_BR";

export async function seed(knex) {
  await knex("product").del();

  const batchSize = 1000;
  const total = 1000000;
  for (let i = 0; i < total; i += batchSize) {
    const batch = Array.from({ length: batchSize }, () => ({
      nome_descricao: faker.commerce.productName(),
      descricao_curta: faker.commerce.productDescription(),
      codigo_barras: faker.string.numeric(13),
      custo: parseFloat(faker.commerce.price()),
      preco: parseFloat(faker.commerce.price()),
      unidade: faker.word.sample(),
      ativo: faker.datatype.boolean(),
      excluido: faker.datatype.boolean(),
    }));

    await knex("product").insert(batch);
  }
}