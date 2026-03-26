const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export async function seed(knex) {

  // 1. BUSCA OS DADOS DA API DO IBGE
  const resposta = await fetch(URL_ESTADOS);

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar estados: ${resposta.statusText}`);
  }
  const estados = await resposta.json();

  // 2. BUSCA O ID DO BRASIL NA TABELA country
  const brasil = await knex('country').where({ codigo: 'BR' }).first();
  if (!brasil) {
    throw new Error('País Brasil (BR) não encontrado na tabela country. Rode o seed de countries primeiro.');
  }

  // 3. LIMPA A TABELA ANTES DE INSERIR
  await knex('federative_unit').del();

  // 4. MAPEIA O JSON PARA O FORMATO DA TABELA
  const dados = estados.map((estado) => ({
    id_country: brasil.id,
    codigo_uf: String(estado.id),
    nome: estado.nome,
    sigla: estado.sigla,
  }));

  // 5. INSERE EM LOTES DE 100
  const batchSize = 100;
  for (let i = 0; i < dados.length; i += batchSize) {
    const lote = dados.slice(i, i + batchSize);
    await knex('federative_unit').insert(lote);
    console.log(`Inseridos ${Math.min(i + batchSize, dados.length)} de ${dados.length} estados`);
  }

  console.log('Seed de estados concluída com sucesso!');
}