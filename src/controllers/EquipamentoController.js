const knex = require("../database");""
const schemaName = "public";

module.exports = {
  async index(req, res, next) {
    try {
      const nome = req.query.nome;
      const numSerieEquipamento = req.query.n_serie_equipamento || req.body.n_serie_equipamento;
      const numSerieBateria = req.query.n_serie_bateria;
      const equipamento_status = req.query.equipamento_status;

      const query = knex("Equipamento").withSchema(schemaName);

      if (nome) query.where("nome", nome);
      if (numSerieEquipamento) query.where("numero_serie_equipamento", numSerieEquipamento);
      if (equipamento_status != undefined && equipamento_status != "") {
        query.where("equipamento_status", equipamento_status);
      }
      if (numSerieBateria) {
        query.join(
          "Bateria_associada",
          "Bateria_associada.id_equipamento",
          "Equipamento.numero_serie_equipamento"
        );
        query.where("Bateria_associada.id_bateria", numSerieBateria);
      }

      const results = await query;
      res.status(200).json(results).send();
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      await knex("Equipamento").withSchema(schemaName).insert({
        numero_serie_equipamento: req.body.numero_serie_equipamento.toUpperCase(),
        equipamento_status: req.body.equipamento_status.toUpperCase(),
        nome: req.body.nome.toUpperCase(),
        foto: req.body.foto,
        foto64: req.body.foto64,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  },
  async indexSerie(req, res, next) {
    try {
      const results = await knex("Equipamento")
        .withSchema(schemaName)
        .leftJoin(
          "Bateria_associada",
          "Equipamento.numero_serie_equipamento",
          "Bateria_associada.id_equipamento"
        )
        .where("Bateria_associada.id_equipamento", null)
        .andWhere("Equipamento.equipamento_status", "EM FUNCIONAMENTO")
        .select("Equipamento.numero_serie_equipamento");
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexSerieEstoque(req, res, next) {
    try {
      const results = await knex("Equipamento")
        .withSchema(schemaName)
        .leftJoin(
          "Estoque",
          "Equipamento.numero_serie_equipamento",
          "Estoque.numero_serie_equipamento"
        )
        .where("Equipamento.equipamento_status", "EM FUNCIONAMENTO")
        .andWhere(function () {
          this.orWhere(knex.raw("Estoque.ativo <> ?", [1])).orWhereNull("Estoque.ativo");
        })
        .select("Equipamento.numero_serie_equipamento");
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      await knex("Equipamento")
        .withSchema(schemaName)
        .update({
          equipamento_status: req.body.equipamento_status,
          foto64: req.body.foto64,
        })
        .where({ numero_serie_equipamento: req.body.numero_serie_equipamento });

      await knex("Estoque")
        .withSchema(schemaName)
        .update("emergencia", false)
        .where("numero_serie_equipamento", req.body.numero_serie_equipamento)
        .where("ativo", true);

      return res.send();
    } catch (error) {
      next(error);
    }
  },
  async indexInativo(req, res, next) {
    try {
      const query = knex("Equipamento").withSchema(schemaName);
      query.leftJoin(
        "Estoque",
        "Estoque.numero_serie_equipamento",
        "Equipamento.numero_serie_equipamento"
      );
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");
      query.select("Equipamento.numero_serie_equipamento");
      query.select("Equipamento.equipamento_status");
      query.select("Estoque.kit");
      query.select("Parceiro.razao_social");
      query.where("equipamento_status", "COM DEFEITO");
      query.where("Estoque.ativo", true);
      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexManutencao(req, res, next) {
    try {
      const { numero_serie_equipamento } = req.body;

      const query = knex("Equipamento").withSchema(schemaName);
      query.select("numero_serie_equipamento");
      query.select("equipamento_status");
      query.where("equipamento_status", "EM MANUTENÇÃO");

      if (numero_serie_equipamento != undefined) {
        query.where("numero_serie_equipamento", numero_serie_equipamento);
      }
      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexManutencaoComBateria(req, res, next) {
    try {
      const { numero_serie_equipamento } = req.body;
      const { numero_serie_bateria } = req.body;

      console.log(numero_serie_equipamento);
      console.log(numero_serie_bateria);

      // Query pra equipamento
      const equipamentoQuery = knex("Equipamento").withSchema(schemaName);
      equipamentoQuery.select("numero_serie_equipamento");
      equipamentoQuery.select("equipamento_status");
      equipamentoQuery.where("equipamento_status", "EM MANUTENÇÃO");
      if (numero_serie_equipamento != undefined && numero_serie_equipamento != "") {
        equipamentoQuery.where("numero_serie_equipamento", numero_serie_equipamento);
      }
      const equipamentoResult = await equipamentoQuery;

      // Query para bateria
      const bateriaQuery = knex("Bateria").withSchema(schemaName);
      bateriaQuery.select("numero_serie_bateria");
      bateriaQuery.select("bateria_status");
      bateriaQuery.where("bateria_status", "EM MANUTENÇÃO");
      if (numero_serie_bateria != undefined && numero_serie_bateria != "") {
        bateriaQuery.where("numero_serie_bateria", numero_serie_bateria);
      }
      const bateriaResult = await bateriaQuery;

      res.json({ equipamento: equipamentoResult, bateria: bateriaResult });
    } catch (error) {
      next(error);
    }
  },
  async returnEquipment(req, res, next) {
    try {
      const documentoUsuario = req.body.documentoUsuario;

      const query = knex("Locacao").withSchema(schemaName);
      query.join("Usuario", "Usuario.documento", "Locacao.documento");
      query.join(
        "Equipamento",
        "Equipamento.numero_serie_equipamento",
        "Locacao.numero_serie_equipamento"
      );
      query.join("Bateria", "Locacao.numero_serie_bateria", "Bateria.numero_serie_bateria");

      query.where("Usuario.documento", documentoUsuario);
      query.andWhere("Locacao.devolvido", false);

      query.select("Usuario.nome as nome_usuario");
      query.select("Equipamento.nome as nome_equipamento");
      query.select("Equipamento.foto");
      query.select("Equipamento.foto64");
      query.select("Bateria.carga");

      const result = await query;
      res.json(result);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
};
