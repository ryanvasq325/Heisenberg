import { faker } from "@faker-js/faker/locale/pt_BR";

export async function seed(knex) {
  await knex("users").del();

  const bathSize = 1000;

  const total = 10000;

  for (let i = 0; i < total; i += bathSize) {
    const batch = Array.from({ length: bathSize }, () => ({
      nome: faker.person.fullName(),
      cpf: faker.string.numeric(11),
      rg: faker.string.numeric(9),
      ativo: faker.datatype.boolean(),
    }));
    await knex("users").insert(batch);
  }
}
