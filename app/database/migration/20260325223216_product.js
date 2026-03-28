export function up(knex) {
    return knex.schema.createTable('product', (table) => {
            table.bigIncrements('id').primary();
            table.text('nome').notNullable();
            table.text('codigo_barra');
            table.text('unidade');
            table.decimal('preco_compra', 18, 4).defaultTo(0);
            table.decimal('margem_lucro', 18, 4).defaultTo(0);
            table.decimal('preco_venda', 18, 4).defaultTo(0);
            table.text('descricao');
            table.boolean('ativo').defaultTo(true);
        table.boolean('excluido').defaultTo(false);
        table.timestamp('criado_em', { useTz: false })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: false })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
        });
}

export function down(knex) {
    return knex.schema.dropTable('product');
}

