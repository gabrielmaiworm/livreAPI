import knex from '../database';
const schemaName = "public"

export function user(knex) { 
    knex.schema.withSchema(schemaName).selectTable('Usuario', table =>{
        table.string('nome',250)
        table.string('sobrenome',250)
        table.string('senha', 5)
    });    
}//busca do usuário por e-mail
export function adm(knex) { 
    knex.schema.withSchema(schemaName).selectTable('Funcionario', table =>{
        table.string('nome',250)
        table.string('sobrenome',250)
        table.string('senha', 5)
    });     
}//busca do funcionário por e-mail
//declarações de variáveis
const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const letras = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
var nome = ''
var sobrenome = ''
var senha = ''
var confimar_senha = ''

inserirdados();//inserir dados para confirmar senha
function inserirdados() {
    require(`Nome: ${letras.nome}`);
    require(`Sobrenome: ${letras.sobrenome}`);
    for (var i=0; i< 5; i++) {
        require(`Senha: ${chars.senha}`);
        require(`Confirmar Senha: ${chars.confirmar_senha}`);
    }
}
validarSenha();//verificar se as senhas são iguais
function validarSenha() {
    if (senha.value != confimar_senha.value) {
        confimar_senha.setCustomValidity("Senhas diferentes!");
        confimar_senha.reportValidity();
        return false;
    } else {
        confimar_senha.setCustomValidity("");
        return true;
    }
} 
// verificar também quando o campo for modificado, para que a mensagem suma quando as senhas forem iguais
confimar_senha.addEventListener('input', validarSenha);

ir_termo_compromisso();//ler o termo de compromisso e confirmar
function ir_termo_compromisso() {
    window.location.href = '../TermoDeCompromisso.jsx' 
        alert('Email enviado com sucesso') 
}
//rotas
const routes = require('express').Router();
const UsuarioController= require('./controllers/UsuarioController')
const FuncionarioController= require('./controllers/FuncionarioController')

routes.get("/usuario", UsuarioController.index);
routes.post("/usuario", UsuarioController.create);
routes.get("/usuario-cpf", UsuarioController.indexCPF);
routes.get("/funcionario-admin", FuncionarioController.indexAdmin);

routes.post('/forgot', function (req, res, _next) {
    db.knex(req.body.email, (err, doc) => {
        if (err || !doc)
            res.redirect('/'); //manda pro login mesmo que não ache
        const newpass = chars.senha;
        db.changePassword(req.body.email, newpass);
        require('../mail')(req.body.email, `Sua Nova Senha de Usuário é: ${newpass}`);//acessar senha por email
        var hotText = 'Login';
        var URL = '../Login.jsx';
        require('../mail')(req.body.email, `Clique aqui para fazer o seu novo ${hotText.link(URL)}`);//ir para apágina de login
        res.redirect('/');
    });
})//senha confirmada enviada por e-mail(mensagem)

module.exports = routes; //busca e exportação das rotas


