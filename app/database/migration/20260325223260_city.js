exports.up = function (knex) {
    return knex.schema.createTable('city', (table) => {
        table.comment('Tabela de cidades disponíveis no sistema');
        // Chave primária auto-incremental (equivalente ao biginteger com identity)
        table.bigIncrements('id').primary();
        //Código do estado
        table.bigInteger('id_uf');
        // Código do cidade
        table.text('codigo').nullable();
        // Nome da cidade
        table.text('nome').nullable();
        // Data e hora de criação do registro — preenchida automaticamente
        table.timestamp('criado_em', { useTz: false })
            .notNullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora de criação do registro');
        // Data e hora da última atualização — atualizada automaticamente via trigger
        table.timestamp('atualizado_em', { useTz: false })
            .nullable()
            .defaultTo(knex.fn.now())
            .comment('Data e hora da última atualização do registro');
        table
            .foreign('id_uf')             // coluna local
            .references('id')             // coluna referenciada
            .inTable('federative_unit')   // tabela referenciada
            .onDelete('CASCADE')          // ao deletar o pai, deleta os filhos
            .onUpdate('NO ACTION');       // ao atualizar o pai, não faz nada
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('city');
};