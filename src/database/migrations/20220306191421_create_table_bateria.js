

// exports.up = knex => knex.schema.createTable('Bateria', table =>{
//     table.string('numero_serie',25).unique().notNullable().primary()    
//     table.string('status',300)
//     table.integer('carga')
//     table.string('foto',300)
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.timestamp('updated_at').defaultTo(knex.fn.now())
//   });

// exports.down = knex => knex.schema.dropTable('Bateria');
