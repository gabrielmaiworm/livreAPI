//const jwt = require('../config/jwt');
const SECRET='9f3d23a61ad6e526f7c70761720a59fb'
const TEMPO='14400000'
const jwt = require("jsonwebtoken");
const knex = require("../database");
const bcrypt = require("bcryptjs");
const schemaName = "public";
const secret = '9f3d23a61ad6e526f7c70761720a59fb';
const timer = '14400000';

const { Client } = require("@googlemaps/google-maps-services-js");
const { query } = require("express");
const mapsClient = new Client({});

module.exports = {
  async index(req, res, next) {
    try {
      const nomeFantasia = req.body.nomeFantasia;
      const razaoSocial = req.body.razaoSocial;
      const documentoEmpresa = req.body.documentoEmpresa;

      const { documento_empresa, razao_social } = req.query;

      const query = knex("Parceiro").withSchema(schemaName);

      if (nomeFantasia) {
        query.where("nome_fantasia", nomeFantasia);
      }

      if ((razaoSocial && razaoSocial != "") || (razao_social && razao_social != "")) {
        query.where("razao_social", razaoSocial ?? razao_social);
      }

      if (
        (documentoEmpresa && documentoEmpresa != "") ||
        (documento_empresa && documento_empresa != "")
      ) {
        query.where("documento_empresa", documentoEmpresa ?? documento_empresa);
      }

      const results = await query;

      // for (const result of results) {
      //   let tempoEsperaString = ""
      //   let tempoTarifaString = ""

      //   let tempoEsperaHours = result?.tempo_espera.getHours() + 3;
      //   if (tempoEsperaHours >= 24) tempoEsperaHours -= 24
      //   if (tempoEsperaHours < 10) tempoEsperaString += "0"
      //   tempoEsperaString += `${tempoEsperaHours}:`

      //   const tempoEsperaMinutes = result?.tempo_espera.getMinutes();
      //   if (tempoEsperaMinutes < 10) tempoEsperaString += "0"
      //   tempoEsperaString += tempoEsperaMinutes

      //   result.tempo_espera = tempoEsperaString

      //   let tempoTarifaHours = result.tempo_tarifa.getHours() + 3;
      //   if (tempoTarifaHours >= 24) tempoTarifaHours -= 24
      //   if (tempoTarifaHours < 10) tempoTarifaString += "0"
      //   tempoTarifaString += `${tempoTarifaHours}:`

      //   const tempoTarifaMinutes = result.tempo_tarifa.getMinutes();
      //   if (tempoTarifaMinutes < 10) tempoTarifaString += "0"
      //   tempoTarifaString += tempoTarifaMinutes

      //   result.tempo_tarifa = tempoTarifaString
        
      // }

      
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async indexComEquipamentos(req, res, next) {
    try {
      const { numero_serie_equipamento, numero_serie_bateria, documento_empresa, kit } = req.query;

      const queryParceiro = knex("Parceiro").withSchema(schemaName);

      if (documento_empresa && documento_empresa != "") {
        queryParceiro.where("documento_empresa", documento_empresa);
      }

      const parceiro = await queryParceiro;

      if (parceiro.length > 0) {
        const queryEstoque = knex("Estoque").withSchema(schemaName);
        queryEstoque.leftJoin(
          "Bateria",
          "Bateria.numero_serie_bateria",
          "Estoque.numero_serie_bateria"
        );
        queryEstoque.leftJoin(
          "Equipamento",
          "Equipamento.numero_serie_equipamento",
          "Estoque.numero_serie_equipamento"
        );

        queryEstoque.select("Estoque.*");
        queryEstoque.select("Bateria.bateria_status");
        queryEstoque.select("Bateria.carga");
        queryEstoque.select("Equipamento.nome");
        queryEstoque.select("Equipamento.equipamento_status");
        queryEstoque.where("Estoque.ativo", true);
        queryEstoque.whereNot("parceiro", null);

        queryUsuario = knex("Locacao").withSchema(schemaName);
        queryUsuario.leftJoin("Usuario", "Usuario.documento", "Locacao.documento");
        queryUsuario.where("Locacao.devolvido", false);
        queryUsuario.select("Usuario.nome");
        queryUsuario.select("Usuario.sobrenome");
        queryUsuario.select("Usuario.documento");
        queryUsuario.select("Locacao.kit");

        const usuarios = await queryUsuario;

        if (numero_serie_equipamento && numero_serie_equipamento != "") {
          queryEstoque.where("Estoque.numero_serie_equipamento", numero_serie_equipamento);
        }

        if (numero_serie_bateria && numero_serie_bateria != "") {
          queryEstoque.where("Estoque.numero_serie_bateria", numero_serie_bateria);
        }

        if (kit && kit != "") {
          queryEstoque.where("Estoque.kit", kit);
        }

        const estoque = await queryEstoque;

        estoque.forEach((kit) => {
          const donoDoKit = parceiro.find((e) => e.documento_empresa == kit.parceiro);
          if (donoDoKit) {
            if (!("kits" in donoDoKit)) {
              donoDoKit.kits = [];
            }
            if (usuarios.some((e) => e.kit == kit.kit)) {
              kit.usuario = usuarios.filter((e) => e.kit == kit.kit)[0];
            }
            donoDoKit.kits.push(kit);
          }
        });

        const parceiroComEquipamento = parceiro.filter((e) => e.kits != undefined);
        res.json(parceiroComEquipamento);
      } else {
        res.json(parceiro);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async indexAdmin(req, res, next) {
    try {
      const query = knex("Parceiro").withSchema(schemaName).where("id", 1);

      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async update_senha(req, res) {
    var hash = "";
    try {
      hash = await bcrypt.hash(req.body.senha, 10);
    } catch {
      hash = req.body.senha;
    }
    try {
      await knex("Parceiro")
        .withSchema(schemaName)
        .where({ documento: req.body.documento })
        .update({ senha: hash });
      return res.status(201).send();
    } catch (error) {
      return res.status(500).send();
    }
  },
  async create(req, res, next) {
    const documento_empresa = req.body.documento_empresa;
    const token = jwt.sign({ documento_empresa }, secret, { expiresIn: timer });
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const logradouro = req.body.logradouro;
      const numero = req.body.numero;
      const bairro = req.body.bairro;
      const cidade = req.body.cidade;

      const fullAddress = `${logradouro} ${numero} ${bairro} ${cidade}`;

      const mapsResult = await mapsClient.geocode({
        params: {
          key: apiKey,
          address: fullAddress,
        },
      });

      const { lat } = mapsResult.data.results[0].geometry.location;
      const { lng } = mapsResult.data.results[0].geometry.location;

      const horario_abertura = req.body.horario_abertura;
      const horario_fechamento = req.body.horario_fechamento;

      var results = await knex("Parceiro")
        .withSchema(schemaName)
        .insert({
          email: req.body.email,
          cep: req.body.cep,
          logradouro: logradouro,
          numero: numero,
          complemento: req.body.complemento,
          bairro: bairro,
          cidade: cidade,
          estado: req.body.estado,
          nome_fantasia: req.body.nome_fantasia,
          razao_social: req.body.razao_social,
          inscricao_estadual: req.body.inscricao_estadual,
          tipo_de_servico: req.body.tipo_de_servico,
          documento_empresa: req.body.documento_empresa,
          telefone: req.body.telefone,
          foto: req.body.foto,
          foto64: req.body.foto64,
          latitude: lat || req.body.latitude,
          longitude: lng || req.body.longitude,
          nivel: req.body.acesso,
          horario_abertura: horario_abertura,
          horario_fechamento: horario_fechamento,
        })
        .returning(["email", "documento_empresa"]);
      return res.status(201).send({ results, token });
    } catch (error) {
      if (error.toString().includes("duplicate key")) {
        return res.status(500).send({ error: "Documento da empresa já cadastrado no sistema" });
      } else {
        next(error);
      }
    }
  },
  async authenticate(req, res) {
    var authheader = req.headers.authorization;
    if (!authheader) {
      var err = new Error("You are not authenticated!");
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");
    var email = auth[0];
    var senha = auth[1];
    const result = await knex("Parceiro")
      .withSchema(schemaName)
      .where({ email: email })
      .select("Parceiro.*")
      .select("Nivel.*")
      .join("Nivel", "Nivel.id", "Parceiro.nivel");
    console.log(result);
    if (!result) return res.status(400).send({ error: "Parceiro não encontrado" });
    try {
      if (!(await bcrypt.compare(senha, result[0].senha)))
        return res.status(400).send({ error: "Senha invalida" });
    } catch (error) {
      return res.status(401).send({ error, result });
    }
    result[0].foto = `${process.env.APP_URL}/` + result[0].foto;
    const documento_empresa = result[0].documento_empresa;
    const token = jwt.sign({ documento_empresa }, secret, { expiresIn: timer });
    res.status(200).send({
      result,
      token,
    });
  },
  async update(req, res, next) {
    const { documento_empresa } = req.body;
    //const token = jwt.sign({documento_empresa} , secret, {expiresIn: timer});
    try {
      const body = req.body;
      delete body.documento_empresa;

      var results = await knex("Parceiro")
        .withSchema(schemaName)
        .where({ documento_empresa: documento_empresa })
        .update(body)
        .returning(["email", "documento_empresa"]);
      return res.status(201).send({ results });
    } catch (error) {
      next(error);
    }
  },
  async indexParceiros(req, res, next) {
    try {
      const results = await knex("Parceiro")
        .withSchema(schemaName)
        .select("razao_social")
        .select("documento");
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
};
