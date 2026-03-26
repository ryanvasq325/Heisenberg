export function up(knex) {
    return knex.schema.createTable('product', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome_descricao').notNullable();
        table.text('descricao_curta').notNullable();
        table.text('codigo_barras').notNullable();
        table.decimal('custo', 18, 4).notNullable();
        table.decimal('preco', 18, 4).notNullable();
        table.text('unidade').notNullable();
        table.boolean('ativo').defaultTo(false);
        table.boolean('excluido').defaultTo(false);
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
        });
}

export function down(knex) {
    return knex.schema.dropTable('product');
}

