const { query } = require("express");
const knex = require("../database");
const { sendEmergencyResolved } = require("./socket_io");
const schemaName = "public";
const secret = '9f3d23a61ad6e526f7c70761720a59fb';
const timer = '14400000';

module.exports = {
  async index(req, res, next) {
    const kitParam = req.params.kit;
    const {numero_serie_equipamento} = req.query;

    console.log("Numero serie equipamento: ", numero_serie_equipamento);

    const numeroSerieEquipamento = req.body.numeroSerieEquipamento;
    const numeroSerieBateria = req.body.numeroSerieBateria;

    try {
      const query = knex("Estoque").withSchema(schemaName);
      query.join("Bateria", "Bateria.numero_serie_bateria", "Estoque.numero_serie_bateria");
      query.join(
        "Equipamento",
        "Estoque.numero_serie_equipamento",
        "Equipamento.numero_serie_equipamento"
      );
      query.leftJoin("Locacao", "Locacao.kit", "Estoque.kit");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");
      query.where("Estoque.ativo", true);
      query.andWhere("Bateria.carga", ">", 80);
      query.andWhere("Bateria.bateria_status", "EM FUNCIONAMENTO");
      query.andWhere("Equipamento.equipamento_status", "EM FUNCIONAMENTO");
      query.andWhere("Estoque.emprestado", false);

      if (kitParam != undefined && kitParam != "") {
        query.where("Estoque.kit", kitParam);
      }

      if (numeroSerieEquipamento) {
        query.andWhere("Equipamento.numero_serie_equipamento", numeroSerieEquipamento);
      }

      if (numero_serie_equipamento) {
        query.andWhere("Equipamento.numero_serie_equipamento", numero_serie_equipamento);
      }

      if (numeroSerieBateria) {
        query.andWhere("Bateria.numero_serie_bateria", numeroSerieBateria);
      }

      query.select("Estoque.numero_serie_equipamento");
      query.select("Estoque.numero_serie_bateria");
      query.select("Bateria.bateria_status");
      query.select("Bateria.carga");
      query.select("Equipamento.equipamento_status");
      query.select("Equipamento.nome");
      query.select("Equipamento.foto");
      query.select("Equipamento.foto64");
      query.select("Estoque.kit");
      query.select("Estoque.parceiro");
      query.select("Estoque.qr");
      query.select("Estoque.qr64");
      query.select("Estoque.ativo");
      query.select("Estoque.latitude");
      query.select("Estoque.longitude");
      query.select("Estoque.altitude");
      query.select("Estoque.velocidade");
      query.select("Estoque.direcao");
      query.select("Estoque.PDOP");
      query.select("Estoque.VDOP");
      query.select("Estoque.satelites");
      query.select("Estoque.rodaGirando");
      query.select("Estoque.panico");

      query.select("Estoque.motor_cabo_motor");
      query.select("Estoque.bateria_carregador_plug");
      query.select("Estoque.modulo_cabos");
      query.select("Estoque.display");
      query.select("Estoque.acelerador");
      query.select("Estoque.suporte_acoplamento");
      query.select("Estoque.guidao");
      query.select("Estoque.barra_direcao");
      query.select("Estoque.suspensao");
      query.select("Estoque.roda_dianteira");
      query.select("Estoque.pneus");
      query.select("Estoque.cavalete");
      query.select("Estoque.acoplamento");


      query.select("Parceiro.razao_social");
      query.select("Parceiro.nome_fantasia");
      

      // evitar que venha duplicatas, pega somente o ultimo de cada locacao
      query.max("Locacao.data_devolucao", { as: "devolucao" });
      query.groupBy("Estoque.numero_serie_equipamento");
      query.groupBy("Estoque.numero_serie_bateria");
      query.groupBy("Bateria.bateria_status");
      query.groupBy("Bateria.carga");
      query.groupBy("Equipamento.equipamento_status");
      query.groupBy("Equipamento.nome");
      query.groupBy("Equipamento.foto");
      query.groupBy("Equipamento.foto64");
      query.groupBy("Estoque.kit");
      query.groupBy("Estoque.parceiro");
      query.groupBy("Estoque.qr");
      query.groupBy("Estoque.qr64");
      query.groupBy("Estoque.ativo");
      query.groupBy("Estoque.latitude");
      query.groupBy("Estoque.longitude");
      query.groupBy("Estoque.altitude");
      query.groupBy("Estoque.velocidade");
      query.groupBy("Estoque.direcao");
      query.groupBy("Estoque.PDOP");
      query.groupBy("Estoque.VDOP");
      query.groupBy("Estoque.satelites");
      query.groupBy("Estoque.rodaGirando");
      query.groupBy("Estoque.panico");
      query.select("Estoque.motor_cabo_motor");
      query.select("Estoque.bateria_carregador_plug");
      query.select("Estoque.modulo_cabos");
      query.select("Estoque.display");
      query.select("Estoque.acelerador");
      query.select("Estoque.suporte_acoplamento");
      query.select("Estoque.guidao");
      query.select("Estoque.barra_direcao");
      query.select("Estoque.suspensao");
      query.select("Estoque.roda_dianteira");
      query.select("Estoque.pneus");
      query.select("Estoque.cavalete");
      query.select("Estoque.acoplamento");
      query.groupBy("Parceiro.razao_social");
      query.groupBy("Parceiro.nome_fantasia");

      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexTotal(req, res, next) {
    try {
      const kitParam = req.params.kit;

      const nomeEquipamento = req.query.nomeEquipamento;
      const numeroSerieEquipamento = req.query.numeroSerieEquipamento;
      const numeroSerieBateria = req.query.numeroSerieBateria;

      const query = knex("Estoque").withSchema(schemaName);
      query.join(
        "Equipamento",
        "Equipamento.numero_serie_equipamento",
        "Estoque.numero_serie_equipamento"
      );
      query.join("Bateria", "Bateria.numero_serie_bateria", "Estoque.numero_serie_bateria");
      query.leftJoin("Locacao", "Locacao.kit", "Estoque.kit");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");

      query.where("Estoque.ativo", true);

      if (nomeEquipamento) {
        query.andWhere("Equipamento.nome", nomeEquipamento);
      }

      if (numeroSerieEquipamento) {
        query.andWhere("Equipamento.numero_serie_equipamento", numeroSerieEquipamento);
      }

      if (numeroSerieBateria) {
        query.andWhere("Bateria.numero_serie_bateria", numeroSerieBateria);
      }

      if (kitParam != undefined && kitParam != "") {
        query.where("Estoque.kit", kitParam);
      }

      query.select("Estoque.numero_serie_equipamento");
      query.select("Estoque.numero_serie_bateria");
      query.select("Bateria.bateria_status");
      query.select("Bateria.carga");
      query.select("Equipamento.equipamento_status");
      query.select("Equipamento.nome");
      query.select("Equipamento.foto");
      query.select("Equipamento.foto64");
      query.select("Estoque.kit");
      query.select("Estoque.parceiro");
      query.select("Estoque.qr");
      query.select("Estoque.qr64");
      query.select("Estoque.ativo");
      query.select("Estoque.latitude");
      query.select("Estoque.longitude");
      query.select("Estoque.altitude");
      query.select("Estoque.velocidade");
      query.select("Estoque.direcao");
      query.select("Estoque.PDOP");
      query.select("Estoque.VDOP");
      query.select("Estoque.satelites");
      query.select("Estoque.rodaGirando");
      query.select("Estoque.panico");
      query.select("Parceiro.razao_social");
      query.select("Estoque.motor_cabo_motor");
      query.select("Estoque.bateria_carregador_plug");
      query.select("Estoque.modulo_cabos");
      query.select("Estoque.display");
      query.select("Estoque.acelerador");
      query.select("Estoque.suporte_acoplamento");
      query.select("Estoque.guidao");
      query.select("Estoque.barra_direcao");
      query.select("Estoque.suspensao");
      query.select("Estoque.roda_dianteira");
      query.select("Estoque.pneus");
      query.select("Estoque.cavalete");
      query.select("Estoque.acoplamento");

      query.max("Locacao.data_devolucao", { as: "devolucao" });

      query.groupBy("Estoque.numero_serie_equipamento");
      query.groupBy("Estoque.numero_serie_bateria");
      query.groupBy("Bateria.bateria_status");
      query.groupBy("Bateria.carga");
      query.groupBy("Equipamento.equipamento_status");
      query.groupBy("Equipamento.nome");
      query.groupBy("Equipamento.foto");
      query.groupBy("Equipamento.foto64");
      query.groupBy("Estoque.kit");
      query.groupBy("Estoque.parceiro");
      query.groupBy("Estoque.qr");
      query.groupBy("Estoque.qr64");
      query.groupBy("Estoque.ativo");
      query.groupBy("Estoque.latitude");
      query.groupBy("Estoque.longitude");
      query.groupBy("Estoque.altitude");
      query.groupBy("Estoque.velocidade");
      query.groupBy("Estoque.direcao");
      query.groupBy("Estoque.PDOP");
      query.groupBy("Estoque.VDOP");
      query.groupBy("Estoque.satelites");
      query.groupBy("Estoque.rodaGirando");
      query.groupBy("Estoque.panico");
      query.select("Estoque.motor_cabo_motor");
      query.select("Estoque.bateria_carregador_plug");
      query.select("Estoque.modulo_cabos");
      query.select("Estoque.display");
      query.select("Estoque.acelerador");
      query.select("Estoque.suporte_acoplamento");
      query.select("Estoque.guidao");
      query.select("Estoque.barra_direcao");
      query.select("Estoque.suspensao");
      query.select("Estoque.roda_dianteira");
      query.select("Estoque.pneus");
      query.select("Estoque.cavalete");
      query.select("Estoque.acoplamento");
      query.groupBy("Parceiro.razao_social");

      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    const numero_serie_bateria = req.body.numero_serie_bateria;
    const numero_serie_equipamento = req.body.numero_serie_equipamento;
    const razao_social = req.body.razao_social;

    try {
      const queryToCheckMontedEquipment = knex("Estoque")
        .withSchema(schemaName)
        .where(function () {
          this.where("numero_serie_equipamento", numero_serie_equipamento).orWhere(
            "numero_serie_bateria",
            numero_serie_bateria
          );
        })
        .andWhere("ativo", true);

      const resultToCheckMontedEquipment = await queryToCheckMontedEquipment;
      console.log(resultToCheckMontedEquipment);

      if (resultToCheckMontedEquipment.length == 0) {
        const insertQuery = {
          numero_serie_bateria: req.body.numero_serie_bateria,
          numero_serie_equipamento: req.body.numero_serie_equipamento,
          ativo: true,
          data_atualizacao: knex.fn.now(),
          qr: req.body.qr,
          qr64: req.body.qr64,
        };

        if (razao_social) {
          const getParceiro = await knex("Parceiro")
            .withSchema(schemaName)
            .where("razao_social", razao_social);

          if (getParceiro.length != 0) {
            insertQuery.parceiro = getParceiro[0].documento_empresa;
          }
        }

        var result = await knex("Estoque")
          .withSchema(schemaName)
          .insert(insertQuery)
          .returning(["kit", "numero_serie_equipamento"]);
        return res.status(201).json(result).send();
      } else {
        return res
          .status(500)
          .json({
            error: "Equipamento ou bateria já em uso",
          })
          .send();
      }
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { kit } = req.body;
      var result = await knex("Estoque")
        .withSchema(schemaName)
        .update("data_atualizacao", knex.fn.now())
        .update("ativo", false)
        .where("kit", kit)
        .returning(["kit", "numero_serie_equipamento"]);
      return res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  },

  async updatecheck(req, res, next) {
    try {
      await knex("Estoque").update({

        // "bateria_status": "EM FUNCIONAMENTO",
        // "carga": "100",
        // "equipamento_status": "EM FUNCIONAMENTO",
        // "nome": "CADEIRA MOTOR",
        // "foto": null,
        // "foto64": "",


          motor_cabo_motor : req.body.motor_cabo_motor,
          bateria_carregador_plug : req.body.bateria_carregador_plug,
          modulo_cabos : req.body.modulo_cabos,
          display : req.body.display,
          acelerador : req.body.acelerador,
          suporte_acoplamento : req.body.suporte_acoplamento,
          guidao : req.body.guidao,
          barra_direcao : req.body.barra_direcao,
          suspensao : req.body.suspensao,
          roda_dianteira : req.body.roda_dianteira,
          pneus : req.body.pneus,
          cavalete : req.body.cavalete,
          acoplamento : req.body.acoplamento,

      })  


   
      return res.status(201).send("Equipamento atualizado com sucesso!");
    } catch (error) {
      next(error);
    }
  },


  // async update(req, res, next) {
  //   try {
  //     await knex("Bateria")
        
  //       .update({
  //         bateria_status: req.body.bateria_status,
  //         carga: req.body.carga,
  //       })
  //       .where({ numero_serie_bateria: req.body.numero_serie_bateria });

  //     await knex("Estoque")
        
  //       .update("emergencia", false)
  //       .where("numero_serie_bateria", req.body.numero_serie_bateria)
  //       .where("ativo", true);
  //     return res.send();
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  async updateGenerico(req, res, next) {
    try {
      const { kit } = req.params;
      const result = await knex("Estoque")
        .withSchema(schemaName)
        .update(req.body)
        .where("kit", kit);
      return res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  },
  async updateTotal(req, res, next) {
    try {
      const {
        numero_serie_bateria,
        numero_serie_equipamento,
        ativo,
        tempo_utilizacao,
        qr,
        qr64,
        parceiro,
      } = req.body;
      const query = knex("Estoque").withSchema(schemaName);
      query.update("data_atualizacao", knex.fn.now());
      if (tempo_utilizacao) {
        query.update("tempo_utilizacao", tempo_utilização);
      }
      if (ativo) {
        query.update("ativo", ativo);
      }
      if (numero_serie_bateria) {
        query.update("numero_serie_bateria", numero_serie_bateria);
      }
      if (qr) {
        query.update("qr", qr);
      }
      if (qr64) {
        query.update("qr64", qr64);
      }
      if (parceiro) {
        query.update("parceiro", parceiro);
      }
      if (numero_serie_equipamento) {
        query.update("numero_serie_equipamento", numero_serie_equipamento);
      }
      query.where("numero_serie_bateria", numero_serie_bateria);
      query.andWhere("numero_serie_equipamento", numero_serie_equipamento);
      return res.send();
    } catch (error) {
      next(error);
    }
  },



  async desmontarKit  (req, res, next) {
    try {
      await knex("Estoque")

        .where({
          kit: req.body.kit,
         
        }).del();
      return res.send("kit desmontado!");
    } catch (error) {
      next(error);
    };
      //Retornar mensagem de sucesso quando excluir o registro com sucesso no banco de dados
     
      
    

  },





  async delete(req, res, next) {
    try {
      await knex("Estoque")
        .withSchema(schemaName)
        .update({
          data_atualizacao: knex.fn.now(),
          ativo: false,
        })
        .where({
          numero_serie_bateria: req.body.numero_serie_bateria,
          numero_serie_equipamento: req.body.numero_serie_equipamento,
        });
      return res.send();
    } catch (error) {
      next(error);
    }
  },
  async indexInativo(req, res, next) {
    try {
      const query = knex("Estoque").withSchema(schemaName);
      query.leftJoin(
        "Equipamento",
        "Equipamento.numero_serie_equipamento",
        "Estoque.numero_serie_equipamento"
      );
      query.leftJoin("Bateria", "Bateria.numero_serie_bateria", "Estoque.numero_serie_bateria");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");

      query.where("ativo", 1);
      query.where(function () {
        this.where("Equipamento.equipamento_status", "COM DEFEITO").orWhere(
          "Bateria.bateria_status",
          "COM DEFEITO"
        );
      });

      query.select("Estoque.kit");
      query.select("Parceiro.razao_social");
      query.select("Equipamento.nome");
      query.select("Equipamento.numero_serie_equipamento");
      query.select("Equipamento.equipamento_status");
      query.select("Bateria.numero_serie_bateria");
      query.select("Bateria.bateria_status");

      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexManutencao(req, res, next) {
    try {
      const kitParam = req.params.kit;

      const { numero_serie_bateria, numero_serie_equipamento, kit } = req.query;

      const query = knex("Estoque").withSchema(schemaName);
      query.leftJoin("Bateria", "Bateria.numero_serie_bateria", "Estoque.numero_serie_bateria");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");
      query.leftJoin(
        "Equipamento",
        "Equipamento.numero_serie_equipamento",
        "Estoque.numero_serie_equipamento"
      );

      if (numero_serie_equipamento != undefined && numero_serie_equipamento != "") {
        query.where("Equipamento.numero_serie_equipamento", numero_serie_equipamento);
      }

      if (numero_serie_bateria != undefined && numero_serie_bateria != "") {
        query.where("Bateria.numero_serie_bateria", numero_serie_bateria);
      }

      if (kit != undefined && kit != "") {
        query.where("Estoque.kit", kit);
      }

      if (kitParam != undefined && kitParam != "") {
        query.where("Estoque.kit", kitParam);
      }

      query.where(function () {
        this.where("Bateria.bateria_status", "EM MANUTENÇÃO").orWhere(
          "Equipamento.equipamento_status",
          "EM MANUTENÇÃO"
        );
      });
      query.where("ativo", true);
      query.whereNot("Equipamento.equipamento_status", "COM DEFEITO");
      query.whereNot("Bateria.bateria_status", "COM DEFEITO");

      query.select("Estoque.kit");
      query.select("Estoque.numero_serie_equipamento");
      query.select("Estoque.numero_serie_bateria");
      query.select("Bateria.bateria_status");
      query.select("Bateria.carga");
      query.select("Equipamento.equipamento_status");
      query.select("Equipamento.nome");
      
      query.select("Parceiro.razao_social");

      const results = await query;
      res.json(results);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async emitPanic(req, res, next) {
    const { kit } = req.query;
    const updateQuery = knex("Estoque").withSchema(schemaName);
    updateQuery.where("kit", kit);
    updateQuery.update("panico", true);

    await updateQuery;
    res.json({ message: "Botão de panico ativado!" }).status(200).send();
  },
  async indexEmergencia(req, res, next) {
    try {
      const query = knex("Estoque").withSchema(schemaName);
      query.leftJoin("Bateria", "Bateria.numero_serie_bateria", "Estoque.numero_serie_bateria");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");

      query.where("Estoque.ativo", true);

      query.where(function () {
        this.where("Bateria.carga", "<=", 20)
          .orWhere({ rodaGirando: false })
          .orWhere("Estoque.emergencia", true);
      });

      query.whereNot("Bateria.bateria_status", "EM MANUTENÇÃO");

      query.select("Estoque.*");
      query.select("Bateria.carga as carga_bateria");
      query.select("Parceiro.razao_social");

      const result = await query;
      res.json(result).status(200).send();
    } catch (error) {
      console.error('Error on "indexEmergencia" (EstoqueController): ', error);
      res.status(500).send();
    }
  },
  async updateEmergencia(req, res, next) {
    try {
      const { kit, motivo_emergencia } = req.body;

      const updateQuery = knex("Estoque").withSchema(schemaName);
      updateQuery.update("emergencia", true);

      if (motivo_emergencia) {
        updateQuery.update("motivo_emergencia", motivo_emergencia);
      }

      updateQuery.where("kit", kit);
      const result = await updateQuery;
      res.json(result).status(200).send();
    } catch (error) {
      next(error);
    }
  },
  async resolverEmergencia(req, res, next) {
    try {
      const { kit } = req.body;

      const updateQuery = knex("Estoque").withSchema(schemaName);
      updateQuery.update({ emergencia: false, motivo_emergencia: null });
      updateQuery.where("kit", kit);

      sendEmergencyResolved(kit);
      const result = await updateQuery;
      res.json(result).status(200).send();
    } catch (error) {
      next(error);
    }
  },
  async indexReservado(req, res, next) {
    try {
      const { documento } = req.query;
      const query = knex("Estoque").withSchema(schemaName);
      query.leftJoin("Reservas", "Reservas.kit", "Estoque.kit");
      query.leftJoin(
        "Equipamento",
        "Estoque.numero_serie_equipamento",
        "Equipamento.numero_serie_equipamento"
      );
      query.leftJoin("Usuario", "Usuario.documento", "Reservas.cliente");
      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Estoque.parceiro");

      query.where("Estoque.ativo", true);
      query.where("Reservas.data_devolucao", null);
      query.whereNot("Reservas.kit", null);

      if (documento != undefined && documento.length > 0) {
        query.where("Reservas.cliente", documento);
      }

      query.select("Usuario.nome as cliente_nome");
      query.select("Parceiro.razao_social");
      query.select(
        "Estoque.kit",
        "Equipamento.nome as equipamento_nome",
        "Estoque.numero_serie_equipamento",
        "Estoque.numero_serie_bateria",
        "Estoque.parceiro"
      );
      query.select("Reservas.cliente", "Reservas.data_reserva");
      query.select("Equipamento.foto64");

      const result = await query;
      res.status(200).json(result);
    } catch (error) {
      console.error("Error on 'indexReservado': ", error);
      res.status(500).json({
        status: false,
        message: "unexpected error",
        body: null,
      });
    }
  },
  async reservarEquipamento(req, res, next) {
    try {
      const { documento, kit, horaReservada } = req.body;

      const insertQuery = knex("Reservas").withSchema(schemaName);
      insertQuery.insert({
        cliente: documento,
        kit: kit,
        data_reserva: horaReservada,
      });

      const queryResult = await insertQuery;
      res.status(200).json({
        status: true,
        message: "Reservado com sucesso!",
        body: queryResult,
      });

      const getQuery = await knex("Estoque").withSchema(schemaName).where("kit", kit);

      const equipamento = getQuery[0].numero_serie_equipamento;
      const bateria = getQuery[0].numero_serie_bateria;

      const updateEquipamento = await knex("Equipamento")
        .withSchema(schemaName)
        .update({ equipamento_status: "EM RESERVA" })
        .where("numero_serie_equipamento", equipamento);
      const updateBateria = await knex("Bateria")
        .withSchema(schemaName)
        .update({ bateria_status: "EM RESERVA" })
        .where("numero_serie_bateria", bateria);
    } catch (error) {
      console.error("Error on 'reservarEquipamento': ", error);
      res.status(500).json({
        status: false,
        message: "unexpected error",
        body: null,
      });
    }
  },
  async cancelarReserva(req, res, next) {
    try {
      const { kit, documento } = req.body;

      const update = {
        data_devolucao: new Date().toISOString().slice(0, 19).replace("T", " "),
        cancelado: true,
      };
      const where = { kit: kit, cliente: documento, data_devolucao: null };

      await knex("Reservas").withSchema(schemaName).update(update).where(where);
      res.status(200).json({ message: "Cancelado" });

      const kitDados = await knex("Estoque").withSchema(schemaName).where("kit", kit);

      console.log("Kit Dados: ", kitDados);
      if (kitDados != undefined && kitDados.length > 0) {
        const equipUpdate = { equipamento_status: "EM FUNCIONAMENTO" };
        const equipWhere = { numero_serie_equipamento: kitDados[0].numero_serie_equipamento };
        await knex("Equipamento").withSchema(schemaName).update(equipUpdate).where(equipWhere);

        const bateriaUpdate = { bateria_status: "EM FUNCIONAMENTO" };
        const bateriaWhere = { numero_serie_bateria: kitDados[0].numero_serie_bateria };
        await knex("Bateria").withSchema(schemaName).update(bateriaUpdate).where(bateriaWhere);
      }
    } catch (error) {
      console.log("Error on 'cancelarReserva': ", error);
      res.status(500).json(error);
    }
  },
  async prolongarReserva(req, res, next) {
    try {
      const { documento, kit, now } = req.body;

      if (documento != undefined && kit != undefined && now != undefined) {
        const result = await knex("Reservas")
          .withSchema(schemaName)
          .update({
            data_reserva: now,
          })
          .where({
            cliente: documento,
            kit: kit,
            data_devolucao: null,
          });

        console.log(result);

        res.status(200).json({
          message: "success",
        });
      } else {
        res.status(500).json({
          message: "unkown error",
        });
      }
    } catch (error) {
      console.error("Error on 'prolongarReserva': ", error);
      res.status(500).json({
        message: "unkown error",
      });
    }
  },
  async verificarEquipamentosAtrasados() {
    try {
      const now = new Date();
      const minutesToAdd = 15;
      if (now.getMinutes() + minutesToAdd < 60) {
        const newMinutes = now.getMinutes() + minutesToAdd;
        now.setMinutes(newMinutes);
      } else {
        const newMinutes = now.getMinutes() + minutesToAdd - 60;
        const newHour = now.getHours() + 1;
        now.setMinutes(newMinutes);
        now.setHours(newHour);
      }

      console.log(now);

      const query = knex("Reservas").withSchema(schemaName);
      query.where("data_devolucao", null);
      query.where("data_reserva", "<", now);
      const result = await query;
      return result;
    } catch (error) {
      console.error("Error on 'verificarEquipamentosAtrasados': ", error);
      return [];
    }
  },
  async verificarEquipamentosAtrasados() {
    try {
      const now = new Date();
      now.setMinutes(15);
      const query = knex("Reservas").withSchema(schemaName);
      query.where("data_devolucao", null);
      query.where("data_reserva", ">", now);
      const result = await query;
      return result;
    } catch (error) {
      console.error("Error on 'verificarEquipamentosAtrasados': ", error);
      return [];
    }
  },
};
