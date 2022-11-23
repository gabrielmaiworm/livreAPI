
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return knex('Bateria').del()
      .then(function () {
      return knex('Bateria').insert([
        {
            numero_serie_bateria: "00000",
            bateria_status: "EM MANUTENÇÃO",
            carga: "10"
          }
      ]);
    });
  };


