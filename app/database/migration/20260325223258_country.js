export function up(knex) {
    return knex.schema.createTable('country', (table) => {
        table.bigIncrements('id').primary();
        table.text('codigo').notNullable();
        table.text('nome').notNullable();
        table.text('localizacao').notNullable();
        table.text('lingua').notNullable();
        table.text('moeda').notNullable();
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
        });
    }
export function down(knex) {
    return knex.schema.dropTable('country');
}