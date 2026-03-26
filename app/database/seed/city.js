const URL_MUNICIPIOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/distritos';

export async function seed(knex) {

  // 1. BUSCA OS DADOS DA API DO IBGE
  const resposta = await fetch(URL_MUNICIPIOS);

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar distritos: ${resposta.statusText}`);
  }
  const distritos = await resposta.json();

  // 2. BUSCA TODOS OS ESTADOS JÁ INSERIDOS (mapeia codigo_uf → id)
  const estados = await knex('federative_unit').select('id', 'codigo_uf');
  if (!estados.length) {
    throw new Error('Nenhum estado encontrado. Rode o seed de federative_unit primeiro.');
  }
  const mapaUF = Object.fromEntries(estados.map((e) => [e.codigo_uf, e.id]));

  // 3. LIMPA A TABELA ANTES DE INSERIR
  await knex('city').del();

  // 4. MAPEIA O JSON PARA O FORMATO DA TABELA
  const dados = distritos
    .map((distrito) => {
      const codigoUF = String(distrito.municipio?.microrregiao?.mesorregiao?.UF?.id);
      const id_uf = mapaUF[codigoUF] ?? null;
      return {
        id_uf,
        nome: distrito.nome,
        codigo_ibge: String(distrito.id),
      };
    })
    .filter((c) => c.id_uf !== null);

  // 5. INSERE EM LOTES DE 100
  const batchSize = 100;
  for (let i = 0; i < dados.length; i += batchSize) {
    const lote = dados.slice(i, i + batchSize);
    await knex('city').insert(lote);
    console.log(`Inseridos ${Math.min(i + batchSize, dados.length)} de ${dados.length} distritos`);
  }

  console.log('Seed de distritos concluída com sucesso!');
}