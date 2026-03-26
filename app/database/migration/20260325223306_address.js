export function up(knex) {
    return knex.schema.createTable('address', (table) => {
        table.bigIncrements('id').primary();
        table.integer('id_city').unsigned();
        table.integer('id_customer').unsigned();
        table.integer('id_supplier').unsigned();
        table.integer('id_enterprise').unsigned();
        table.text('logradouro').notNullable();
        table.text('bairro').notNullable();
        table.text('cep').notNullable();
        table.integer('numero').notNullable();
        table.text('complemento');
        table.timestamp('criado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de criação do registro');

        table.timestamp('atualizado_em', { useTz: true })
                .defaultTo(knex.fn.now())
                .comment('Data de atualização do registro');


        table.foreign('id_city').references('id').inTable('city')
        table.foreign('id_customer').references('id').inTable('customer')
        table.foreign('id_supplier').references('id').inTable('supplier')
        table.foreign('id_enterprise').references('id').inTable('enterprise')
    });
}



export function down(knex) {
    return knex.schema.dropTable('address');
}