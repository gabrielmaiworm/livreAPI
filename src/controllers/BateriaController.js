const knex = require("../database");


module.exports = {
  async index(req, res, next) {
    try {
      const { numero_serie_bateria, bateria_status, carga } = req.query;
      const { campo } = req.body;

      const query = knex("Bateria");

      if (numero_serie_bateria) {
        query.where("numero_serie_bateria", numero_serie_bateria);
      }

      if (bateria_status != undefined && bateria_status != "") {
        query.where("bateria_status", bateria_status);
      }

      if (carga != undefined && carga != "") {
        query.where("carga", carga);
      }

      if (campo) {
        query.select(campo);
      }

      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      await knex("Bateria").insert({
        numero_serie_bateria: req.body.numero_serie_bateria,
        bateria_status: req.body.bateria_status.toUpperCase(),
        carga: req.body.carga,
      });
      return res.status(201).send();
    } catch (error) {
      next(error);
    }
  },
  async indexSerie(req, res, next) {
    try {
      const results = await knex("Bateria")
        
        .leftJoin("Locacao", "Bateria.numero_serie_bateria", "Locacao.numero_serie_bateria")
        .where("Bateria.bateria_status", "EM FUNCIONAMENTO")
        .andWhere("Bateria.carga", ">", 80)
        .andWhere(function () {
          this.orWhere({ "Locacao.ativo": "1" }).orWhereNull("Locacao.numero_serie_bateria");
        })
        .select("Bateria.numero_serie_bateria");
      //  .select('Bateria.RFID_bateria')
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexSerieEstoque(req, res, next) {
    try {
      const query = knex("Bateria");
      query.leftJoin("Estoque", "Estoque.numero_serie_bateria", "Bateria.numero_serie_bateria");
      query.select("Bateria.numero_serie_bateria");
      query.select("Bateria.bateria_status");
      query.select("Estoque.kit");
      query.where("Bateria.bateria_status", "EM FUNCIONAMENTO");
      const results = await query;
      res.json(results);
      return res.send();
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      await knex("Bateria")
        
        .update({
          bateria_status: req.body.bateria_status,
          carga: req.body.carga,
        })
        .where({ numero_serie_bateria: req.body.numero_serie_bateria });

      await knex("Estoque")
        
        .update("emergencia", false)
        .where("numero_serie_bateria", req.body.numero_serie_bateria)
        .where("ativo", true);
      return res.send();
    } catch (error) {
      next(error);
    }
  },
  async indexInativo(req, res, next) {
    try {
      const query = knex("Bateria");
      query.leftJoin("Estoque", "Estoque.numero_serie_bateria", "Bateria.numero_serie_bateria");
      query.select("Bateria.numero_serie_bateria");
      query.select("Bateria.bateria_status");
      query.select("Estoque.kit");
      query.where("bateria_status", "COM DEFEITO");
      const results = await query;
      res.json(results);
      return res.send();
    } catch (error) {
      next(error);
    }
  },
  async indexManutencao(req, res, next) {
    try {
      const { numero_serie_bateria } = req.body;

      const query = knex("Bateria");
      query.select("numero_serie_bateria");
      query.select("bateria_status");
      query.select("carga");

      if (numero_serie_bateria != undefined) {
        query.where("numero_serie_bateria", numero_serie_bateria);
      }
      query.where("bateria_status", "EM MANUTENÇÃO");
      const results = await query;
      res.json(results);
      return res.send();
    } catch (error) {
      next(error);
    }
  },
};
