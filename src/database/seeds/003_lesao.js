

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Lesao').del()
  await knex('Lesao').insert([
    {id: 1, tipo: 'PARAPLEGIA'},
    {id: 2, tipo: 'TETRAPLEGIA'},
    {id: 3, tipo: 'AMPUTADO'},
    {id: 4, tipo: 'MOBILIDADE REDUZIDA'},
    {id: 5, tipo: 'LESÃO TEMPORÁRIA'},
    {id: 6, tipo: 'SEM LESÃO'},
    {id: 7, tipo: 'OUTRO'}
  ]);
};
