export function up(knex) {
    return knex.schema.createTable('federative_unit', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('id_pais');
        table.text('codigo').notNullable();
        table.text('nome').nullable();
        table.text('sigla').nullable();
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
                
                table.foreign('id_pais').references('id').inTable('country').onDelete('CASCADE').onUpdate('NO ACTION');
        });
}


export function down(knex) {
    return knex.schema.dropTable('federative_unit');
}