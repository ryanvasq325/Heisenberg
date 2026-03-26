export function up(knex) {
    return knex.schema.createTable('supplier', (table) => {
        table.bigIncrements('id').primary();
        table.text('nome_fantasia').notNullable();
        table.text('razao_social');
        table.text('cnpj_cpf');
        table.text('rg_ie');
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
    return knex.schema.dropTable('supplier');
}