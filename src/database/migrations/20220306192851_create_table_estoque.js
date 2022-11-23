

// exports.up = knex => knex.schema.createTable('Estoque', table =>{
//     table.increments('id').unique().notNullable().primary() 
//     table.boolean('ativo')
//     table.decimal('tempo_utilizacao',8, 2)
//     table.date('data_atualizacao')
//     table.string('evento',100)
//     table.string('numero_serie_equipamento',25).references('numero_serie_equipamento').inTable('Equipamento')
//     table.string('numero_serie_bateria',25).references('numero_serie').inTable('Bateria')
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.timestamp('updated_at').defaultTo(knex.fn.now())
//   });

// exports.down = knex => knex.schema.dropTable('Estoque');