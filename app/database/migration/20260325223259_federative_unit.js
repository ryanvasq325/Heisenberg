export function up(knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.bigIncrements('id').primary();
        table.integer('id_country').unsigned();
        table.text('codigo_uf').notNullable();
        table.text('nome').notNullable();
        table.text('sigla').notNullable();
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
                
                table.foreign('id_country').references('id').inTable('country')
        });
}


export function down(knex) {
    return knex.schema.dropTable('federative_unit');
}