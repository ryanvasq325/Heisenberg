exports.seed = async function(knex) {
  await knex('product').del()
  await knex('product').insert([
    {id: 1, colName: 'rowValue1'},
    {id: 2, colName: 'rowValue2'},
    {id: 3, colName: 'rowValue3'}
  ]);
};
