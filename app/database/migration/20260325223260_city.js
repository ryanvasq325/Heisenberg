export function up(knex) {
    return knex.schema.createTable('city', (table) => {
        table.bigIncrements('id').primary();
        table.integer('id_uf').unsigned();
        table.text('nome').notNullable();
        table.text('codigo_ibge').notNullable();
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
                
                table.foreign('id_uf').references('id').inTable('federative_unit')
        });
}


export function down(knex) {
    return knex.schema.dropTable('city');
}