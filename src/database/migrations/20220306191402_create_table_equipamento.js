

// exports.up = knex => knex.schema.createTable('Equipamento', table =>{
//     table.string('numero_serie_equipamento',25).unique().notNullable().primary()
//     table.string('nome',250)
//     table.string('equipamento_status',300)
//     table.string('foto',300)
//     table.string('foto64',300)
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.timestamp('updated_at').defaultTo(knex.fn.now())
//   });

// exports.down = knex => knex.schema.dropTable('Equipamento');
