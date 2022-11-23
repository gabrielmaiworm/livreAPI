const knex = require("../database");
const schemaName = "public";

module.exports = {
  async index(req, res, next) {
    try {
      const { dataInicial, dataFinal, documento, mostrarEmergencia, mostrarFoto } = req.query;
      const { campo = "data_solicitacao" } = req.params;

      const query = knex("Locacao").withSchema(schemaName);

      query.join("Usuario", "Locacao.documento", "Usuario.documento");
      query.leftJoin("Bateria", "Bateria.numero_serie_bateria", "Locacao.numero_serie_bateria");
      query.leftJoin(
        "Equipamento",
        "Equipamento.numero_serie_equipamento",
        "Locacao.numero_serie_equipamento"
      );

      query.leftJoin("Estoque", "Estoque.kit", "Locacao.kit");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");

      query.where("Locacao.devolvido", false);
      if (mostrarEmergencia == null || mostrarEmergencia == undefined || !mostrarEmergencia) {
        query.where("Estoque.emergencia", false);
      }

      if (dataInicial) {
        query.andWhere(campo, ">=", dataInicial);
      }

      if (dataFinal) {
        query.andWhere(campo, "<=", dataFinal);
      }

      if (documento) {
        query.andWhere("Usuario.documento", documento);
      }

      if (mostrarFoto) {
        query.select("Equipamento.foto64");
      }

      query.select("Usuario.nome as nome_usuario");
      query.select("Equipamento.nome as nome_equipamento");
      query.select("Locacao.*");
      query.select("Bateria.carga");
      query.select("Parceiro.razao_social");
      query.select("Estoque.latitude");
      query.select("Estoque.longitude");
      query.select("Estoque.emergencia");
      query.orderBy(campo, "desc");

      const results = await query;

      if (results.length == 0) {
        res.status(500);
      }

      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexTotal(req, res, next) {
    try {
      const { dataInicial, dataFinal } = req.query;
      const { campo = "data_solicitacao" } = req.params;
      const query = knex("Locacao")
        .withSchema(schemaName)
        .join("Usuario", "Locacao.documento", "Usuario.documento");
      if (dataInicial) {
        query.where(campo, ">=", dataInicial);
      }
      if (dataFinal) {
        query.where(campo, "<=", dataFinal);
      }
      query.select("Usuario.nome");
      query.select("Locacao.*");
      query.orderBy(campo, "desc");
      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    const numero_serie_equipamento = req.body.numero_serie_equipamento;
    const documento = req.body.documento;

    try {
      const query = knex("Locacao").withSchema(schemaName);
      query.where("Locacao.devolvido", false).andWhere(function () {
        this.orWhere("Locacao.documento", documento).orWhere(
          "Locacao.numero_serie_equipamento",
          numero_serie_equipamento
        );
      });

      const result = await query;
      const usuarioTemEquipamento = result.length > 0;

      let results;
      let status;

      if (usuarioTemEquipamento) {
        console.log(result);
        if (result.documento == documento) {
          results = {
            error: "Usuário já tem equipamento locado",
          };
        } else {
          results = {
            error: "Equipamento já está em uso",
          };
        }
        status = 500;
      } else {
        const query2 = knex("Estoque").withSchema(schemaName);
        query2.update("data_atualizacao", knex.fn.now());
        query2.update("emprestado", true);
        query2.where("numero_serie_equipamento", numero_serie_equipamento);
        query2.andWhere("ativo", true);
        query2.returning(["numero_serie_bateria", "numero_serie_equipamento", "kit"]);
        const results2 = await query2;

        console.log(results2);

        if (results2.length != 0) {
          await knex("Equipamento")
            .withSchema(schemaName)
            .update({ equipamento_status: "EM FUNCIONAMENTO" })
            .where("numero_serie_equipamento", numero_serie_equipamento);

          await knex("Bateria")
            .withSchema(schemaName)
            .update({ bateria_status: "EM FUNCIONAMENTO" })
            .where("numero_serie_bateria", results2[0].numero_serie_bateria);

          const query = knex("Locacao")
            .withSchema(schemaName)
            .insert({
              data_solicitacao: knex.fn.now(),
              numero_serie_equipamento: results2[0].numero_serie_equipamento,
              numero_serie_bateria: results2[0].numero_serie_bateria,
              documento: documento,
              kit: results2[0].kit,
            })
            .returning("*");
          results = await query;
          status = 201;
        } else {
          status = 500;
          results = { error: "algum erro" };
        }
      }

      return res.status(status).json(results);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { documento } = req.body;
      const query = knex("Locacao").withSchema(schemaName);
      query.update({
        data_devolucao: knex.fn.now(),
        status: req.body.status.toUpperCase(),
        sugestao: req.body.sugestao.toUpperCase(),
        avaliacao: req.body.avaliacao,
        devolvido: "true",
        foto: req.body.foto,
      });
      query.where("documento", documento);
      query.andWhere("devolvido", false);
      query.returning("*");
      const result = await query;

      if (result.length != 0) {
        const numero_serie_bateria = result[0].numero_serie_bateria;
        const numero_serie_equipamento = result[0].numero_serie_equipamento;
        const kit = result[0].kit;

        const updateBateria = await knex("Bateria")
          .withSchema(schemaName)
          .update("bateria_status", "EM MANUTENÇÃO")
          .where("numero_serie_bateria", numero_serie_bateria);

        console.log("Update Bateria:", updateBateria);

        const updateEquipamento = await knex("Equipamento")
          .withSchema(schemaName)
          .update("equipamento_status", "EM MANUTENÇÃO")
          .where("numero_serie_equipamento", numero_serie_equipamento);

        console.log("Update Equipamento:", updateEquipamento);

        const updateEmprestado = await knex("Estoque")
          .withSchema(schemaName)
          .update("emprestado", false)
          .where("kit", kit);

        console.log("Update Emprestado:", updateEmprestado);

        await knex("Reservas")
          .withSchema(schemaName)
          .update({ data_devolucao: new Date().toISOString().slice(0, 19).replace("T", " ") })
          .where("cliente", documento)
          .where("kit", result[0].kit);
      }

      return res.status(201).json(result).send();
    } catch (error) {
      next(error);
    }
  },
  async indexOpen(req, res, next) {
    try {
      const query = knex("Locacao")
        .withSchema(schemaName)
        .join("Usuario", "Locacao.documento", "Usuario.documento");
      query.where("devolvido", "=", false);
      query.select("Usuario.nome");
      query.select("Locacao.*");
      query.orderBy("data_solicitacao", "desc");
      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};
