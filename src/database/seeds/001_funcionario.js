

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('Funcionario').del()
  await knex('Funcionario').insert([
    {
    nome: "ADMIN",
    sobrenome: "LIVRE",
    email: "ADMIN@KITLIVRE.COM",
    data_de_nascicmento: "2014-07-16T00:00:00.000Z",
    documento: "123.556.789-00",
    cep: "12224240",
    logradouro: "RUA PETÚNIAS",
    numero: "20",
    complemento: "NA",
    bairro: "JD. MOTORAMA",
    cidade: "SÃO JOSÉ DOS CAMPOS",
    estado: "SP",
    foto_documento: null,
    foto_com_documento: null,
    foto_documento64: "https://firebasestorage.googleapis.com/v0/b/kitlivre-ffbc2.appspot.com/o/user-images%2F1661965470310.jpg?alt=media&token=a2d39486-b374-4875-a9d8-99710bcce70b",
    foto_com_documento64: null,
    nivel: 5,
    senha: "$2a$10$ew9huo.XjRV0AoTGfwoybuUWpsswiLcvKTml/8/lnETVb/k1eBA6q",
    telefone: "1239123494",
    kitlivre: null,
  
    // nome_fantasia: null,
    // razao_social: null,
    // inscricao_estadual: null,
    // tipo_de_servico: null,
    // documento_empresa: null,
    // foto: null,
    // foto64: null,
    // agencia: null,
    // n_conta: null,
    // banco: null,
    // tipo: null,
    // latitude: null,
    // longitude: null,
    // email_parceiro: null,
    // cep_parceiro: null,
    // logradouro_parceiro: null,
    // numero_parceiro: null,
    // complemento_parceiro: null,
    // bairro_parceiro: null,
    // estado_parceiro: null,
    // nivel_parceiro: null,
    // telefone_parceiro: null
  }
  ]);
};
