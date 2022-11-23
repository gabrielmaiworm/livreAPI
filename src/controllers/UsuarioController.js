//const jwt = require('../config/jwt');
const SECRET='9f3d23a61ad6e526f7c70761720a59fb'
const TEMPO='14400000'
const jwt = require("jsonwebtoken");
const knex = require("../database");
const bcrypt = require("bcryptjs");
const schemaName = "public";
const secret = `${SECRET}`;
const timer = `${TEMPO}`;

const EmailController = require("./EmailController");

function checkPasswordStrength(password) {
  const regexp = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/);
  return regexp.test(password);
}

module.exports = {
  checkPasswordStrength,

  async index(req, res, next) {
    try {
      const { documento, email } = req.query;
      const { campo } = req.body;

      const query = knex("Usuario").withSchema(schemaName);;

      query.join("Nivel", "Nivel.id", "Usuario.nivel");

      if (documento) {
        query.where("documento", documento);
      }

      if (email != undefined && email != "") {
        query.where("email", email);
      }

      if (campo) {
        query.select(campo);
      } else {
        query.select("Usuario.*");
        query.select("Nivel.*");
      }
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
      var acesso = 1;
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
      const documento = req.body.documento;
      const token = jwt.sign({ documento }, secret, { expiresIn: timer });
      try {
        const insertQuery = {
          nome: req.body.nome.toUpperCase(),
          sobrenome: req.body.sobrenome.toUpperCase(),
          email: req.body.email.toUpperCase(),
          data_de_nascicmento: data_de_nascicmento,
          documento: req.body.documento,
          senha: hash,
          cep: req.body.cep,
          logradouro: req.body.logradouro.toUpperCase(),
          numero: numero,
          complemento: req.body.complemento.toUpperCase(),
          bairro: req.body.bairro.toUpperCase(),
          cidade: req.body.cidade.toUpperCase(),
          estado: req.body.estado.toUpperCase(),
          situacao_lesao: req.body.situacao_lesao.toUpperCase(),
          nivel_lesao: req.body.nivel_lesao.toUpperCase(),
          detalhe_lesao: req.body.detalhe_lesao.toUpperCase(),
          telefone: req.body.telefone,
          foto_documento: req.body.foto_documento,
          foto_documento64: req.body.foto_documento64,
          foto_com_documento: req.body.foto_com_documento,
          foto_com_documento64: req.body.foto_com_documento64,
          ativo: false,
          nivel: acesso,
        };

        var results = await knex("Usuario")
          
          .insert(insertQuery)
          .returning(["nome", "email", "documento"]);

        // axios.post("https://kitlivreemail.herokuapp.com/send-email", {
        //   userEmail: req.body.email,
        //   documento: documento,
        // });

        await EmailController.sendMailCadastro(req.body.email, req.body.documento);

        return res.status(201).send({ results, token });
      } catch (error) {
        if (error.toString().includes("duplicate key")) {
          res.status(500).send({ duplicateKey: "CPF já cadastrado" });
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
  async activateUser(req, res, next) {
    try {
      const documento = req.body.documento;
      const result = await knex("Usuario")
        
        .where({ documento: documento })
        .update({ ativo: true });
      return res.status(201).send({ result });
    } catch (error) {
      next(error);
    }
  },
  async indexCPF(req, res, next) {
    try {
      const results = await knex("Usuario")
        
        .where({ documento: req.query.documento })
        .select("nome")
        .select("sobrenome")
        .select("foto_documento")
        .select("foto_documento64")
        .select("documento")
        .select("data_de_nascicmento");
      res.redirect("http://localhost:3005/");
    } catch (error) {
      next(error);
    }
  },
  async authenticate(req, res, next) {
    try {
      var authheader = req.headers.authorization;
      if (!authheader) {
        var err = new Error("You are not authenticated!");
        res.setHeader("WWW-Authenticate", "Basic");
        err.status = 401;
        next(err);
      }
      var auth = new Buffer.from(authheader.split(" ")[1], "base64").toString().split(":");

      var email = auth[0];
      var senha = auth[1];

      const result = await knex("Usuario")
        
        .where({ email: email })
        .andWhere("Usuario.ativo", true)
        .select("Usuario.*")
        .select("Nivel.*")
        .join("Nivel", "Nivel.id", "Usuario.nivel");
      if (!result) res.status(400).send({ error: "Usuário não encontrado" });
      try {
        if (!(await bcrypt.compare(senha, result[0].senha)))
          res.status(400).send({ error: "Senha invalida" });
      } catch (error) {
        res.status(401).send({ error, result });
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
    } catch (error) {
      next();
    }
  },
  async authenticatesimples(req, res, next) {
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
    const result = await knex("Usuario")
      
      .where({ email: email })
      //.andWhere('Usuario.ativo',1)
      .select("Usuario.nome")
      .select("Usuario.foto_documento")
      .select("Usuario.foto_documento64")
      .select("Usuario.documento")
      .select("Usuario.nivel")
      .join("Nivel", "Nivel.id", "Usuario.nivel");
    if (!result) return res.status(400).send({ error: "Usuário não encontrado" });
    try {
      if (!(await bcrypt.compare(senha, result[0].senha)))
        return res.status(400).send({ error: "Senha invalida" });
    } catch (error) {
      return res.status(401).send(result);
    }
    const nome = result[0].nome;
    const foto_documento = `${process.env.APP_URL}/` + result[0].foto_documento;
    const foto_documento64 = `${process.env.APP_URL}/` + result[0].foto_documento64;
    const nivel = result[0].nivel;
    const documento = result[0].documento;
    const token = jwt.sign({ documento }, secret, { expiresIn: timer });
    res.status(200).send({
      documento,
      nome,
      foto_documento,
      foto_documento64,
      nivel,
      token,
      result,
    });
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
    var acesso = 1;
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
    var nome,sobrenome,email,cep,logradouro,complemento,bairro,cidade,estado,situacao_lesao,
    nivel_lesao,detalhe_lesao,telefone,foto_documento,foto_documento64,foto_com_documento,foto_com_documento64;
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
      email = req.body.email.toUpperCase();
    }
    catch{
      email = req.body.email;
    }
    try{
      cep = req.body.cep.toUpperCase();
    }
    catch{
      cep = req.body.cep;
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
      situacao_lesao = req.body.situacao_lesao.toUpperCase();
    }
    catch{
      situacao_lesao = req.body.situacao_lesao;
    }
    try{
      nivel_lesao = req.body.nivel_lesao.toUpperCase();
    }
    catch{
      nivel_lesao = req.body.nivel_lesao;
    }
    try{
      detalhe_lesao = req.body.detalhe_lesao.toUpperCase();
    }
    catch{
      detalhe_lesao = req.body.detalhe_lesao;
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
    const body = req.body;
    delete body.documento;
    try {
      var results = await knex("Usuario")
        .withSchema(schemaName)
        .where({ documento: documento })
        .update(body)
        .returning(["nome", "email", "documento"]);
      return res.status(201).send({ results, token });
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
      await knex("Usuario")
        .withSchema(schemaName)
        .where({ documento: req.body.documento })
        .update({ senha: hash });
      return res.status(201).send();
    } catch (error) {
      return res.status(500).send();
    }
  },
  async createADM(req, res, next) {
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
    var acesso = 1;
    if (nivel) acesso = nivel;
    const senha = Math.random().toString(36).substring(0, 7);
    try {
      hash = await bcrypt.hash(senha, 10);
    } catch {
      hash = senha;
    }
    var numero = "";
    try {
      numero = req.body.numero.toUpperCase();
    } catch {
      numero = req.body.numero;
    }
    const documento = req.body.documento;
    const token = jwt.sign({ documento }, secret, { expiresIn: timer });
    try {
      var results = await knex("Usuario")
        .withSchema(schemaName)
        .insert({
          nome: req.body.nome.toUpperCase(),
          sobrenome: req.body.sobrenome.toUpperCase(),
          email: req.body.email.toUpperCase(),
          data_de_nascicmento: req.body.data_de_nascicmento,
          documento: req.body.documento,
          senha: hash,
          cep: req.body.cep,
          logradouro: req.body.logradouro.toUpperCase(),
          numero: req.body.numero,
          complemento: req.body.complemento.toUpperCase(),
          bairro: req.body.bairro.toUpperCase(),
          cidade: req.body.cidade.toUpperCase(),
          estado: req.body.estado.toUpperCase(),
          situacao_lesao: req.body.situacao_lesao.toUpperCase(),
          nivel_lesao: req.body.nivel_lesao.toUpperCase(),
          detalhe_lesao: req.body.detalhe_lesao.toUpperCase(),
          telefone: req.body.telefone,
          foto_documento: req.body.foto_documento,
          foto_documento64: req.body.foto_documento64,
          foto_com_documento: req.body.foto_com_documento,
          foto_com_documento64: req.body.foto_com_documento64,
          ativo: true,
          nivel: req.body.acesso,
        })
        .returning(["nome", "email", "documento"]);
      //email.sendMail(req.body.email, senha);
      //email.sendMailCadastro(req.body.email,documento);
      return res.status(201).send({ results, token });
    } catch (error) {
      next(error);
    }
  },
  async createADMNoPass(req, res, next) {
    var data_de_nascicmento = "";
    try {
      if (req.body.data_de_nascicmento.includes("/"))
        data_de_nascicmento = req.body.data_de_nascicmento.split("/").reverse().join("-");
      else data_de_nascicmento = req.body.data_de_nascicmento;
    } catch {
      data_de_nascicmento = "";
    }
    const { nivel } = req.body;
    var acesso = true;
    if (nivel) acesso = nivel;
    var numero = "";
    try {
      numero = req.body.numero.toUpperCase();
    } catch {
      numero = req.body.numero;
    }
    const documento = req.body.documento;
    const token = jwt.sign({ documento }, secret, { expiresIn: timer });
    try {
      var results = await knex("Usuario")
        .withSchema(schemaName)
        .insert({
          nome: req.body.nome.toUpperCase(),
          sobrenome: req.body.sobrenome.toUpperCase(),
          email: req.body.email.toUpperCase(),
          data_de_nascicmento: data_de_nascicmento,
          documento: req.body.documento,
          cep: req.body.cep,
          logradouro: req.body.logradouro.toUpperCase(),
          numero: numero,
          complemento: req.body.complemento.toUpperCase(),
          bairro: req.body.bairro.toUpperCase(),
          cidade: req.body.cidade.toUpperCase(),
          estado: req.body.estado.toUpperCase(),
          situacao_lesao: req.body.situacao_lesao.toUpperCase(),
          nivel_lesao: req.body.nivel_lesao.toUpperCase(),
          detalhe_lesao: req.body.detalhe_lesao.toUpperCase(),
          telefone: req.body.telefone,
          foto_documento: req.body.foto_documento,
          foto_documento64: req.body.foto_documento64,
          foto_com_documento: req.body.foto_com_documento,
          foto_com_documento64: req.body.foto_com_documento64,
          ativo: true,
          nivel: acesso,
        })
        .returning(["nome", "email", "documento"]);
      //email.sendMailSimples(req.body.email,documento);
      //email.sendMailCadastro(req.body.email,documento);
      return res.status(201).send({ results, token });
    } catch (error) {
      next(error);
    }
  },
  async updateAtivo(req, res) {
    var result = await knex("Usuario")
      .withSchema(schemaName)
      .where({ documento: req.query.documento })
      .update({ ativo: true });
    return res.status(201).send({ result });
  },
  async updateSenha(req, res) {
    var hash = "";
    try {
      hash = await bcrypt.hash(req.body.senha, 10);
    } catch {
      hash = req.body.senha;
    }
    var result = await knex("Usuario")
      .withSchema(schemaName)
      .where({ documento: req.query.documento })
      .update({ senha: hash });
    return res.status(201).send({ result });
  },
  async limparTudo(req, res, next) {
    try {
      await knex("Locacao").withSchema(schemaName).del();
      await knex("Usuario").withSchema(schemaName).del();
      await knex("Funcionario").withSchema(schemaName).del();
      await knex("Estoque").withSchema(schemaName).del();
      await knex("Parceiro").withSchema(schemaName).del();
      await knex("Bateria_associada").withSchema(schemaName).del();
      await knex("Bateria").withSchema(schemaName).del();
      await knex("Equipamento").withSchema(schemaName).del();

      const hashSenha = await bcrypt.hash("kitlivre2022", 10);

      await knex("Funcionario").withSchema(schemaName).insert({
        nome: "ADMIN",
        email: "ADMIN@KITLIVRE.COM",
        data_de_nascicmento: "2014-07-16 00:00:00.000",
        documento: "123.556.789-00",
        cep: "12224240",
        logradouro: "RUA PETÚNIAS",
        numero: "20",
        complemento: "NA",
        bairro: "JD. MOTORAMA",
        cidade: "SÃO JOSÉ DOS CAMPOS",
        estado: "SP",
        nivel: 5,
        senha: hashSenha,
        telefone: "1239123494",
        sobrenome: "LIVRE",
      });
      res.status(200).send();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  async sendRecoverPasswordemail(req, res, next) {
    try {
      const { email } = req.body;
      const result = await knex("Usuario").withSchema(schemaName).where("email", email);

      if (result.length > 0) {
        await EmailController.sendMailRecoverPassword(email, result[0].documento);
        res.status(200).json({ message: "Email enviado" }).send();
      } else {
        res.status(500).json({ error: "Email não encontrado" }).send();
      }
    } catch (error) {
      next(error);
    }
  },
};
