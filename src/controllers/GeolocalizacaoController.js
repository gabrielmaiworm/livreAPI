const knex = require("../database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const schemaName = `${process.env.DB_SCHEMA}`;
const authConfig = require("../config/auth");
const { get } = require("mongoose");
// const axios = require("axios").default;
const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});

function generateToken(parms = {}) {
  return jwt.sign(parms, authConfig, {
    expiresIn: 86400,
  });
}

function localizarUsuario() {
  if (window.navigator && window.navigator.geolocation) {
    var geolocation = window.navigator.geolocation;
    geolocation.getCurrentPosition(sucesso, erro);
  } else {
    return res.status(400).send({ error: "Geolocalização não suportada em seu navegador." });
  }
  function sucesso(posicao) {
    console.log(posicao);
    var nome = posicao.nome.toUpperCase();
    var latitude = posicao.coords.latitude;
    var longitude = posicao.coords.longitude;
    return res.String(
      `O usuário ${nome} está localizado em latitude de: ${latitude} e longitude de: ${longitude}`
    );
  }

  var movimento = window.navigator.geolocation.watchPosition(function (posicao) {
    return posicao;
  });
  //para parar de monitorar:
  window.navigator.geolocation.clearWatch(movimento);

  function erro(error) {
    return error;
  }
}

module.exports = {
  async index(req, res, next) {
    try {
      const { cpf } = req.query;
      const { campo } = req.body;
      const query = knex("Usuario").withSchema(schemaName);
      if (cpf) {
        query.where("n_documento", cpf);
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
    var latitude = "";
    var longitude = "";
    var hash = "";
    try {
      if (req.body.latitude.includes("N, S, L, O, º, ", ","))
        latitude = req.body.latitude.split("N, S, L, O, º, ", ",");
      else latitude = req.body.latitude;
    } catch {
      latitude = "";
    }
    try {
      if (req.body.latitude.includes("N, S, L, O, º, ", ","))
        longitude = req.body.longitude.split("N, S, L, O, º, ", ",");
      else longitude = req.body.longitude;
    } catch {
      longitude = "";
    }
    //era isso aqui que precisava
    const { nivel } = req.body;
    var acesso = 1;
    if (nivel) acesso = nivel;
    try {
      hash = await bcrypt.hash(req.body.senha, 5);
    } catch {
      hash = req.body.senha;
    }
    try {
      var results = await knex("Usuario")
        .withSchema(schemaName)
        .insert({
          nome: req.body.nome.toUpperCase(),
          latitude: req.body.latitude.toUpperCase(),
          longitude: req.body.longitude.toUpperCase(),
          email: req.body.email.toUpperCase(),
          documento: req.body.documento,
          senha: hash,
          nivel: acesso,
        })
        .returning(["nome", "latitude", "longitude"]);
      //result.senha = undefined;
      console.log({ token: generateToken({ n_documento: req.body.documento }) });
      return res.status(201).send(results);
      //return res.status(201).send({results, token:generateToken({ id: req.body.documento})})
    } catch (error) {
      next(error);
    }
  },
  async indexCPF(req, res, next) {
    try {
      const results = await knex("Usuario")
        .withSchema(schemaName)
        .where({ n_documento: req.query.cpf })
        .select("nome");
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async authenticate(req, res) {
    const { email, senha, latitude, longitude } = req.body;
    // isso também o join no caso também
    const result = await knex("Usuario")
      .withSchema(schemaName)
      .where({ email: email })
      .select("Usuario.*")
      .select("Nivel.*")
      .join("Nivel", "Nivel.id", "Usuario.nivel");
    const result1 = await knex("Usuario").withSchema(schemaName).select("latitude.*");
    const result2 = await knex("Usuario").withSchema(schemaName).select("longitude.*");

    if (!result) return res.status(400).send({ error: "Usuário não encontrado" });

    if (!(await bcrypt.compare(latitude, result1.latitude)))
      return res.status(400).send({ error: "Latitude não suportada em seu navegador." });
    if (!(await bcrypt.compare(longitude, result2.longitude)))
      return res.status(400).send({ error: "Longitude não suportada em seu navegador." });

    result.senha = undefined;
    result.latitude = undefined;
    result.longitude = undefined;

    res.send({
      result,
      token: generateToken({ id: result.n_documento }),
    });
  },
  async getInUseEquipments(req, res, next) {
    try {
      const query = knex("Estoque").withSchema(schemaName);
      query.leftJoin("Locacao", "Locacao.kit", "Estoque.kit");
      query.leftJoin("Usuario", "Usuario.documento", "Locacao.documento");

      query.whereNot("Estoque.latitude", null);
      query.andWhere("Locacao.data_devolucao", null);
      query.andWhere("Locacao.devolvido", 0);

      query.select("Usuario.nome");
      query.select("Usuario.foto_documento");

      query.select("Estoque.kit");
      query.select("Estoque.ativo");
      query.select("Estoque.tempo_utilizacao");
      query.select("Estoque.evento");
      query.select("Estoque.numero_serie_equipamento");
      query.select("Estoque.numero_serie_bateria");
      query.select("Estoque.emprestado");
      query.select("Estoque.qr64");
      query.select("Estoque.qr");
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
      query.select("Estoque.RFID_equipamento");
      query.select("Estoque.RFID_bateria");
      query.select("Estoque.parceiro");

      const result = await query;
      res.status(200).json(result).send();
    } catch (error) {
      next(error);
    }
  },
  async getParceirosInMap(req, res, next) {
    try {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;

      const query = knex("Parceiro").withSchema(schemaName);
      const results = await query;

      const firstResult = results[0];

      const { logradouro } = firstResult;
      const { numero } = firstResult;
      const { bairro } = firstResult;
      const { cidade } = firstResult;

      const fullAddress = `${logradouro} ${numero} ${bairro} ${cidade}`;

      // const mapsApi = `https://maps.googleapis.com/maps/api/geocode/json?address=${fullAddress}&key=${apiKey}`;

      client
        .geocode({
          params: {
            key: apiKey,
            address: fullAddress,
          },
        })
        .then((response) => {
          res.json(response.data.results).status(200).send();
        })
        .catch((error) => {
          next(error);
        });

      // axios
      //   .get(mapsApi)
      //   .then((result) => {
      //     console.log(result);
      //     res.json(result).status(200).send();
      //   })
      //   .catch((error) => {
      //     console.log(error.message);
      //     next(error.message);
      //   });
    } catch (error) {
      next(error);
    }
  },
  async movimentTest(req, res, next) {
    const { kit } = req.body;

    const positionGroups = [
      [-22.718631, -43.361337],
      [-22.718787, -43.361258],
      [-22.719029, -43.36112],
      [-22.719166, -43.361002],
      [-22.719361, -43.361044],
      [-22.719631, -43.361171],
      [-22.719835, -43.361206],
    ];

    const query = knex("Estoque").withSchema(schemaName);

    let i = 0;
    const myInterval = setInterval(async () => {
      i++;

      query.update("latitude", positionGroups[i][0]);
      query.update("longitude", positionGroups[i][1]);
      query.where("kit", kit);
      await query;
      console.log(positionGroups[i]);

      if (i == positionGroups.length - 1) {
        clearInterval(myInterval);
      }
    }, 9000);

    res.sendStatus(200);
  },
  async positionTest(req, res, next) {
    try {
      const query = knex("Estoque").withSchema(schemaName);
      query.where("kit", 87);
      const result = await query;
      res.json(result).send();
    } catch (error) {
      console.log(error);
    }
  },
};
