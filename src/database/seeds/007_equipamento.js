exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return knex('Equipamento').del()
      .then(function () {
      return knex('Equipamento').insert([
        {
            nome: "KITLIVRE",
            equipamento_status: "EM MANUTENÇÃO",
            numero_serie_equipamento: "00000",
            qr_code: null,
            foto: null,
            foto64: ""
          },
      ]);
    });
  };
