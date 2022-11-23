const knex = require("../database");


module.exports = {
  async index(req, res, next) {
    try {
      const { documento, evento, nome,parceiro } = req.query;
    

      const query = knex("Lista_espera");

      if (documento) {
        query.where("documento", documento);
      }


      const results = await query;
      res.status(200).json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    try {
      await knex("Lista_espera").insert({
        documento: req.body.documento,
        nome: req.body.nome.toUpperCase(),
        parceiro: req.body.parceiro,
        evento: req.body.evento,
      });
      return res.status(201).send("Usuário adicionado com sucesso!");
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await knex("Lista_espera")

        .where({
          documento: req.body.documento,
         
        }).del();
      return res.send("Usuário deletado!");
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      await knex("Lista_espera")
        
        .update({
            documento: req.body.documento,
            nome: req.body.nome.toUpperCase(),
            parceiro: req.body.parceiro,
            evento: req.body.evento,
        })
        .where({ documento: req.body.documento });

      await knex("Lista_espera")
        
       
        .where("documento", req.body.documento)
     
      return res.send("Usuário atualizado com sucesso!");
    } catch (error) {
      next(error);
    }
  },
 
 
};