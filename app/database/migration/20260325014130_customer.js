export function up(knex) {
    return knex.schema.createTable('customer', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('cpf').notNullable();
        table.text('rg').notNullable();
        table.boolean('ativo').defaultTo(true);
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
        });
}


export function down(knex) {
    return knex.schema.dropTable('customer');
}