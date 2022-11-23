

// exports.up = knex => knex.schema.createTable('Nivel', table =>{
//     table.int('id',25).unique().notNullable().primary()    
//     table.string('tipo_usuario',300)
//     table.string('painel_de_gerenciamento',300)
//     table.string('atualizar_equipamentos',300)
//     table.string('estoque_de_equipamentos',300)
//     table.string('solicitacao_de_equipamentos',300)
//     table.string('devolucao_de_equipamentos',300)
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.timestamp('updated_at').defaultTo(knex.fn.now())
//   });

// exports.down = knex => knex.schema.dropTable('Nivel');
