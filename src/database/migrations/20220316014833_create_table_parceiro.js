// const schemaName = `${process.env.DB_SCHEMA}`

// exports.up = knex => knex.schema.createTable('Parceiro', table =>{
//     table.increments('documento').unique().notNullable().primary()
//     table.string('sobrenome',25)
//     table.string('nome',250)
//     table.string('email_parceiro',300)
//     table.date('data_de_nascicmento')
//     table.string('cep',50)
//     table.string('logradouro_funcionario',500)
//     table.string('numero_funcionario',500)
//     table.string('complemento_funcionario',500)
//     table.string('bairro_funcionario',500)
//     table.string('cidade',500)
//     table.string('estado_funcionario',500)
//     table.string('senha',100)
//     table.string('foto_com_documento',500)
//     table.string('foto_documento64',500)
//     table.string('foto_com_documento64',500)
//     table.string('foto_reconheciomento',500)
//     table.string('foto_reconheciomento64',500)
//     table.string('nivel_funcionario',250).references('id').inTable('Nivel')
//     table.string('telefone_funcionario',250)
//     table.string('kitlivre',250)
//     table.string('parceiro',250).references('documento').inTable('Parceiro')
//     table.timestamp('created_at').defaultTo(knex.fn.now())
//     table.timestamp('updated_at').defaultTo(knex.fn.now())
//   });

// exports.down = knex => knex.schema.dropTable('Funcionario');
