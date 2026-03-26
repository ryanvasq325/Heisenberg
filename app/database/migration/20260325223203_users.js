export function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome').notNullable();
        table.text('sobrenome');
        table.text('cpf');
        table.text('rg');
        table.boolean('ativo').defaultTo(true);
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
    return knex.schema.dropTable('users');
}