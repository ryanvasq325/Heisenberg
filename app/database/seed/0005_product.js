import { faker } from "@faker-js/faker/locale/pt_BR";


export async function seed(knex) {

  await knex("product").del();

  const bathSize = 1000;

  const total = 1000000;

  for (let i = 0; i < total; i += bathSize) {
    const batch = Array.from({ length: bathSize }, () => ({
      nome_descricao: faker.commerce.product(),
      descricao_curta: faker.commerce.productDescription(),
      codigo_barras: faker.commerce.isbn(),
      custo: faker.commerce.price(),
      preco: faker.commerce.price(),
      unidade: faker.random.word(),
      ativo: faker.datatype.boolean(),
      excluido: faker.datatype.boolean(),
    }));
    await knex("product").insert(batch);
  }
}
