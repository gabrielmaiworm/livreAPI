

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  return knex('Video').del()
    .then(function () {
    return knex('Video').insert([
      {
        id: 1, 
        url: 'https://www.youtube.com/watch?v=L_ZrgadAxFg'
      }
    ]);
  });
};
