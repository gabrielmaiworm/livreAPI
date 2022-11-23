//const jwt = require('../config/jwt');
const SECRET='9f3d23a61ad6e526f7c70761720a59fb'
const TEMPO='14400000'
const jwt = require("jsonwebtoken");
const knex = require("../database");
const bcrypt = require("bcryptjs");
const { checkPasswordStrength } = require("./UsuarioController");
const schemaName = "public";
const secret = `${SECRET}`;
const timer = `${TEMPO}`;

module.exports = {
  async index(req, res, next) {
    const documentoOperador = req.body.documentoOperador;

    try {
      const query = knex("Funcionario").withSchema(schemaName);

      if (documentoOperador) {
        query.where("documento", documentoOperador);
      }

      query.leftJoin("Parceiro", "Parceiro.documento_empresa", "Funcionario.parceiro");

      query.select("Funcionario.nome");
      query.select("Funcionario.sobrenome");
      query.select("Funcionario.email as email_funcionario");
      query.select("Funcionario.data_de_nascicmento");
      query.select("Funcionario.documento");
      query.select("Funcionario.cep as cep_funcionario");
      query.select("Funcionario.logradouro as logradouro_funcionario");
      query.select("Funcionario.numero as numero_funcionario");
      query.select("Funcionario.complemento as complemento_funcionario");
      query.select("Funcionario.bairro as bairro_funcionario");
      query.select("Funcionario.cidade");
      query.select("Funcionario.estado as estado_funcionario");
      query.select("Funcionario.foto_documento");
      query.select("Funcionario.foto_com_documento");
      query.select("Funcionario.foto_reconhecimento");
      query.select("Funcionario.foto_documento64");
      query.select("Funcionario.foto_com_documento64");
      query.select("Funcionario.foto_reconhecimento64");
      query.select("Funcionario.nivel as nivel_funcionario");
      query.select("Funcionario.senha");
      query.select("Funcionario.telefone as telefone_funcionario");
      query.select("Funcionario.kitlivre");
      query.select("Funcionario.parceiro");

      query.select("Parceiro.nome_fantasia");
      query.select("Parceiro.razao_social");
      query.select("Parceiro.inscricao_estadual");
      query.select("Parceiro.tipo_de_servico");
      query.select("Parceiro.documento_empresa");
      query.select("Parceiro.foto");
      query.select("Parceiro.foto64");
      query.select("Parceiro.agencia");
      query.select("Parceiro.n_conta");
      query.select("Parceiro.banco");
      query.select("Parceiro.tipo");
      query.select("Parceiro.latitude");
      query.select("Parceiro.longitude");
      query.select("Parceiro.email as email_parceiro");
      query.select("Parceiro.cep as cep_parceiro");
      query.select("Parceiro.logradouro as logradouro_parceiro");
      query.select("Parceiro.numero as numero_parceiro");
      query.select("Parceiro.complemento as complemento_parceiro");
      query.select("Parceiro.bairro as bairro_parceiro");
      query.select("Parceiro.estado as estado_parceiro");
      query.select("Parceiro.nivel as nivel_parceiro");
      query.select("Parceiro.telefone as telefone_parceiro");

      const result = await query;

      res.json(result);
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
  async indexAdmin(req, res, next) {
    try {
      const query = knex("Funcionario").withSchema(schemaName).where("id", 1);

      const results = await query;
      res.json(results);
    } catch (error) {
      next(error);
    }
  },
  async create(req, res, next) {
    const senha = req.body.senha;
    const passwordIsStrength = checkPasswordStrength(senha);

    if (passwordIsStrength) {
      var data_de_nascicmento = "";
      var hash = "";
      try {
        if (req.body.data_de_nascicmento.includes("/"))
          data_de_nascicmento = req.body.data_de_nascicmento.split("/").reverse().join("-");
        else data_de_nascicmento = req.body.data_de_nascicmento;
      } catch {
        data_de_nascicmento = "";
      }
      const { nivel } = req.body;
      var acesso = 2;
      if (nivel) acesso = nivel;
      try {
        hash = await bcrypt.hash(req.body.senha, 10);
      } catch {
        hash = req.body.senha;
      }
      var numero = "";
      try {
        numero = req.body.numero.toUpperCase();
      } catch {
        numero = req.body.numero;
      }
      var nome, sobrenome, logradouro, complemento, bairro, cidade, estado;
      try {
        nome = req.body.nome.toUpperCase();
      } catch {
        nome = req.body.nome;
      }
      try {
        sobrenome = req.body.sobrenome.toUpperCase();
      } catch {
        sobrenome = req.body.sobrenome;
      }
      try {
        email = req.body.email.toUpperCase();
      } catch {
        email = req.body.email;
      }
      try {
        logradouro = req.body.logradouro.toUpperCase();
      } catch {
        logradouro = req.body.logradouro;
      }
      try {
        complemento = req.body.complemento.toUpperCase();
      } catch {
        complemento = req.body.complemento;
      }
      try {
        bairro = req.body.bairro.toUpperCase();
      } catch {
        bairro = req.body.bairro;
      }
      try {
        cidade = req.body.cidade.toUpperCase();
      } catch {
        cidade = req.body.cidade;
      }
      try {
        estado = req.body.estado.toUpperCase();
      } catch {
        estado = req.body.estado;
      }

      const documento = req.body.documento;
      const token = jwt.sign({ documento }, secret, { expiresIn: timer });

      const funcionario = {
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        data_de_nascicmento: data_de_nascicmento,
        documento: req.body.documento,
        senha: hash,
        cep: req.body.cep,
        logradouro: logradouro,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        estado: req.body.estado,
        telefone: req.body.telefone,
        foto_documento: req.body.foto_documento,
        foto_documento64: req.body.foto_documento64,
        foto_com_documento: req.body.foto_com_documento,
        foto_com_documento64: req.body.foto_com_documento64,
        kitlivre: req.body.kitlivre,
        nivel: req.body.acesso,
      };

      const parceiroRazaoSocial = req.body.razao_social;

      if (parceiroRazaoSocial) {
        const queryParceiro = await knex("Parceiro")
          .withSchema(schemaName)
          .where("razao_social", parceiroRazaoSocial);

        if (queryParceiro.length != 0) {
          funcionario.parceiro = queryParceiro[0].documento_empresa;
        } else {
          return res.status(500).send({ error: "Razao social inexistente" });
        }
      }

      try {
        var results = await knex("Funcionario")
          .withSchema(schemaName)
          .insert(funcionario)
          .returning(["email", "documento"]);
        return res.status(201).send({ results, token });
      } catch (error) {
        if (error.toString().includes("duplicate key")) {
          return res.status(500).send({ error: "CPF já cadastrado no sistema" });
        } else {
          next(error);
        }
      }
    } else {
      res.status(500).send({
        weakPassword:
          "Senha fraca, insira uma senha com no mínimo 8 caracteres sendo um número, uma letra maiúscula e um caractere especial.",
      });
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
    const result = await knex("Funcionario")
      .withSchema(schemaName)
      .where({ email: email })
      .select("Funcionario.*")
      .select("Nivel.*")
      .join("Nivel", "Nivel.id", "Funcionario.nivel");
    if (!result) return res.status(400).send({ error: "Funcionario não encontrado" });
    try {
      if (!(await bcrypt.compare(senha, result[0].senha)))
        return res.status(400).send({ error: "Senha invalida" });
    } catch (error) {
      console.log(error);
      return res.status(401).send({ error, result });
    }
    result[0].senha = undefined;
    result[0].id = undefined;
    result[0].foto = `${process.env.APP_URL}/` + result[0].foto;
    result[0].fotoComDoc = `${process.env.APP_URL}/` + result[0].fotoComDoc;
    const documento = result[0].documento;
    const token = jwt.sign({ documento }, secret, { expiresIn: timer });
    res.status(200).send({
      result,
      token,
    });
  },
  async update_senha(req, res) {
    var hash = "";
    try {
      hash = await bcrypt.hash(req.body.senha, 10);
    } catch {
      hash = req.body.senha;
    }
    try {
      await knex("Funcionario")
        .withSchema(schemaName)
        .where({ documento: req.body.documento })
        .update({ senha: hash });
      return res.status(201).send();
    } catch (error) {
      return res.status(500).send();
    }
  },
  async update(req, res, next) {
    /*var data_de_nascicmento = '';
    var hash = '';
    try{
      if (req.body.data_de_nascicmento.includes('/'))
      data_de_nascicmento = req.body.data_de_nascicmento.split('/').reverse().join('-');
      else
      data_de_nascicmento = req.body.data_de_nascicmento;
    }
    catch{
      data_de_nascicmento = '';
    }
    const {nivel} = req.body
    var acesso = 2;
    if(nivel)
      acesso = nivel;
    try{
      hash = await bcrypt.hash(req.body.senha, 10);
    }
    catch{
      hash = req.body.senha;
    }
    var numero = '';
    try{
      numero = req.body.numero.toUpperCase();
    }
    catch{
      numero = req.body.numero;
    }
    var nome,sobrenome,logradouro,complemento,bairro,cidade,estado,cep,email,telefone,foto_documento,foto_documento64,foto_com_documento,foto_com_documento64;
    try{
      nome = req.body.nome.toUpperCase();
    }
    catch{
      nome = req.body.nome;
    }
    try{
      sobrenome = req.body.sobrenome.toUpperCase();
    }
    catch{
      sobrenome = req.body.sobrenome;
    }
    try{
      logradouro = req.body.logradouro.toUpperCase();
    }
    catch{
      logradouro = req.body.logradouro;
    }
    try{
      complemento = req.body.complemento.toUpperCase();
    }
    catch{
      complemento = req.body.complemento;
    }
    try{
      bairro = req.body.bairro.toUpperCase();
    }
    catch{
      bairro = req.body.bairro;
    }
    try{
      cidade = req.body.cidade.toUpperCase();
    }
    catch{
      cidade = req.body.cidade;
    }
    try{
      estado = req.body.estado.toUpperCase();
    }
    catch{
      estado = req.body.estado;
    }
    try{
      cep = req.body.cep.toUpperCase();
    }
    catch{
      cep = req.body.cep;
    }
    try{
      email = req.body.email.toUpperCase();
    }
    catch{
      email = req.body.email;
    }
    try{
      telefone = req.body.telefone.toUpperCase();
    }
    catch{
      telefone = req.body.telefone;
    }
    try{
      foto_documento = req.body.foto_documento.toUpperCase();
    }
    catch{
      foto_documento = req.body.foto_documento;
    }
    try{
      foto_documento64 = req.body.foto_documento64.toUpperCase();
    }
    catch{
      foto_documento64 = req.body.foto_documento64;
    }
    try{
      foto_com_documento = req.body.foto_com_documento.toUpperCase();
    }
    catch{
      foto_com_documento = req.body.foto_com_documento;
    }
    try{
      foto_com_documento64 = req.body.foto_com_documento64.toUpperCase();
    }
    catch{
      foto_com_documento64 = req.body.foto_com_documento64;
    }*/
    const documento = req.body.documento;
    const token = jwt.sign({ documento }, secret, { expiresIn: timer });
    try {
      var results = await knex("Funcionario")
        .withSchema(schemaName)
        .where({ documento: req.body.documento })
        /*.update({
        nome: nome,
        sobrenome: sobrenome,
        email: email,
        data_de_nascicmento: data_de_nascicmento,
        senha:hash,
        cep: cep,
        logradouro: logradouro,
        numero: numero,
        complemento: complemento,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        telefone: telefone,
        foto_documento: foto_documento,
        foto_documento64: foto_documento64,
        foto_com_documento: foto_com_documento,
        foto_com_documento64: foto_com_documento64,
        nivel: acesso
      })*/
        .update(req.body)
        .returning(["nome", "email", "documento"]);
      return res.status(201).send({ results, token });
    } catch (error) {
      next(error);
    }
  },
  async assignToBusiness(req, res, next) {
    try {
      const documentoFuncionario = req.body.documentoFuncionario;
      const empresaId = req.body.empresaId;

      const documentoNaoEstaVazio = documentoFuncionario.length > 0;

      if (documentoNaoEstaVazio && empresaId) {
        const query = knex("Funcionario").withSchema(schemaName);
        query.update("parceiro", empresaId);
        query.where("documento", documentoFuncionario);

        const updateResult = await query;

        if (updateResult > 0) {
          res.json({
            message: "Parceiro vinculado ao operador com sucesso!",
            result: updateResult,
          });
          res.status(200).send();
        } else {
          res.json({
            message: "CPF de operador não identificado",
            result: updateResult,
          });
          res.status(500).send();
        }
      } else {
        res.status(500).send();
      }
    } catch (error) {
      const foreignKeyError = error
        .toString()
        .includes("The UPDATE statement conflicted with the FOREIGN KEY constraint");

      if (foreignKeyError) {
        res.json({ message: "Documento da empresa inválido!" });
        res.status(500).send();
      } else {
        next(error);
      }
    }
  },
  async getLinkedBusiness(req, res, next) {
    const documentoOperador = req.body.documentoOperador;

    if (documentoOperador) {
      try {
        const query = knex("Funcionario")
          .withSchema(schemaName)
          .where("documento", documentoOperador)
          .leftJoin("Parceiro", "Parceiro.documento_empresa", "Funcionario.parceiro");

        const result = await query;
        res.json(result);
        res.status(200).send();
      } catch (error) {
        console.log(error);
        next(error);
      }
    } else {
      next({ message: "Documento do operador inválido" });
    }
  },
};
