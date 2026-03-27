// Usa o fetch nativo do Node.js 18+ — sem necessidade de instalar node-fetch
const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
exports.seed = async function (knex) {

  // 1. BUSCA OS DADOS DOS ESTADOS VIA FETCH NATIVO DO NODE.JS
  const resposta = await fetch(URL_ESTADOS);

  if (!resposta.ok) {
    throw new Error(`Falha ao buscar os dados dos estados: ${resposta.statusText}`);
  }

  const estados = await resposta.json();

  // 2. BUSCA O ID DO BRASIL NA TABELA country
  //    equivalente a: SELECT id FROM country WHERE codigo = 'BR' LIMIT 1
  const brasil = await knex('country')
    .select('id')
    .where('codigo', 'BR')
    .first();

  if (!brasil) {
    throw new Error('País Brasil (codigo = BR) não encontrado na tabela country. Execute a seed de países antes.');
  }

  const id_pais = brasil.id;

  console.log(`Brasil encontrado na tabela country com id: ${id_pais}`);

  // 3. LIMPA A TABELA ANTES DE INSERIR OS DADOS  
  await knex('federative_unit').del();

  // 4. MAPEIA O JSON DA API DO IBGE PARA O FORMATO DA TABELA
  const dados = estados.map((estado) => ({
    id_pais,                    // FK para a tabela country (Brasil)
    codigo: String(estado.id),  // Código numérico do IBGE (ex: 11, 12, 13...)
    nome: estado.nome,        // Nome completo  (ex: Rondônia, Acre...)
    sigla: estado.sigla,       // Sigla do estado (ex: RO, AC, AM...)
  }));

  // 5. INSERE TODOS OS 27 ESTADOS DE UMA VEZ
  await knex('federative_unit').insert(dados);

  console.log(`${dados.length} estados inseridos com sucesso!`);

};