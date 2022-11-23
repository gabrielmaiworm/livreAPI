exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('Parceiro').del()
    await knex('Parceiro').insert([
        {
            nome_fantasia: "vasco hindu",
            razao_social: "jorge maroak",
            email: "vascohindu@gmail.com",
            inscricao_estadual: "23423234",
            tipo_de_servico: "transporte",
            telefone: "11111111111",
            documento_empresa: "00.467.605/0001-97",
            cep: "36774100",
            logradouro: "Rua Altamiro Peixoto",
            numero: "1",
            complemento: "",
            bairro: "Haidee",
            cidade: "Cataguases",
            estado: "MG",
            foto: null,
            foto64: "",
            nivel: 2,
            agencia: null,
            n_conta: null,
            banco: null,
            tipo: null,
            latitude: -21.3787144,
            longitude: -42.69515579999999,
            horario_abertura: "00:00",
            horario_fechamento: "18:31",
            taxa_minuto: 10,
            taxa_liberacao: 15,
            taxa_espera: 23,
            tempo_espera: "11:00",
            tempo_tarifa: "12:00"
          }
    ]);
  };
  