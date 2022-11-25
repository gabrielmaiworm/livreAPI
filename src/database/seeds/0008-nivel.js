
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    return knex('Nivel').del()
      .then(function () {
      return knex('Nivel').insert([
        {
            id: 1,
            tipo_usuario: "USUARIO",
            painel_de_gerenciamento: false,
            atualizar_equipamentos: false,
            estoque_de_equipamentos: false,
            solicitacao_de_equipamentos: true,
            devolucao_de_equipamentos: true
          },
          {
            id: 2,
            tipo_usuario: "EQUIPE TECNICA LOGISTICA",
            painel_de_gerenciamento: true,
            atualizar_equipamentos: true,
            estoque_de_equipamentos: true,
            solicitacao_de_equipamentos: true,
            devolucao_de_equipamentos: true
          },
          {
            id: 3,
            tipo_usuario: "EQUIPE TECNICA PRESENCIAL",
            painel_de_gerenciamento: true,
            atualizar_equipamentos: true,
            estoque_de_equipamentos: true,
            solicitacao_de_equipamentos: true,
            devolucao_de_equipamentos: true
          },
          {
            id: 4,
            tipo_usuario: "EQUIPE TECNICA REMOTA",
            painel_de_gerenciamento: true,
            atualizar_equipamentos: true,
            estoque_de_equipamentos: true,
            solicitacao_de_equipamentos: true,
            devolucao_de_equipamentos: true
          },
          {
            id: 5,
            tipo_usuario: "ADMINISTRADOR",
            painel_de_gerenciamento: true,
            atualizar_equipamentos: true,
            estoque_de_equipamentos: true,
            solicitacao_de_equipamentos: true,
            devolucao_de_equipamentos: true
          },
      ]);
    });
  };