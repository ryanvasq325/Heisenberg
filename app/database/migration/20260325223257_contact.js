export function up(knex) {
    return knex.schema.createTable('contact', (table) => {
        table.bigIncrements('id').primary();
        table.integer('users_id').unsigned();
        table.text('email').notNullable();
        table.text('telefone').notNullable();
        table.text('whatsapp').notNullable();
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');
                
                table.foreign('users_id').references('id').inTable('users')
        });
}


export function down(knex) {
    return knex.schema.dropTable('contact');
}