

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Status').del()
  await knex('Status').insert([
    {id: 1, tipo: 'EM FUNCIONAMENTO'},
    {id: 2, tipo: 'EM MANUTENÇÃO'},
    {id: 3, tipo: 'COM DEFEITO'}
  ]);
};
