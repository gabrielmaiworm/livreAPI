

// exports.up = knex => knex.schema.createTable('Usuario', table =>{
//     table.string('documento',25).unique().notNullable().primary()
//     table.string('nome',250)
//     table.string('sobrenome',250)
//     table.string('email',300)
//     table.date('data_de_nascicmento')
//     table.string('cep',25)
//     table.string('logradouro',200)
//     table.string('numero',25)
//     table.string('complemento',250)
//     table.string('bairro',250)
//     table.string('cidade',250)
//     table.string('estado',250)
//     table.string('situacao_lesao',20)
//     table.string('nivel_lesao',25)
//     table.string('detalhe_lesao',500)
//     table.string('foto_documento',300)
//     table.string('foto_documento64',300)
//     table.string('telefone',500)
//     table.string('foto_com_documento',300)
//     table.string('foto_com_documento64',300)
 
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.timestamp('updated_at').defaultTo(knex.fn.now())
//   });

// exports.down = knex => knex.schema.dropTable('Usuario');
