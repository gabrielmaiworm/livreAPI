const routes = require("express").Router();
const path = require("path");
// const multer = require("multer");
// const multerConfig = require("./config/multer");


// const upload = multer({ dest: 'uploads/' })


const SolicitacaoController = require("./controllers/SolicitacaoController");
const EquipamentoController = require("./controllers/EquipamentoController");
const BateriaController = require("./controllers/BateriaController");
const UsuarioController = require("./controllers/UsuarioController");
const FuncionarioController = require("./controllers/FuncionarioController");
const ParceiroController = require("./controllers/ParceiroController");
const EstoqueController = require("./controllers/EstoqueController");
const GeolocalizacaoController = require("./controllers/GeolocalizacaoController");
const ImageUp = require("./controllers/ImageUp");
const LesaoController = require("./controllers/LesaoController");
const StatusController = require("./controllers/StatusController");
const VideoController = require("./controllers/VideoController");
const ListaController = require("./controllers/ListaController");

routes.get("/lista-espera", ListaController.index);
routes.post("/lista-espera", ListaController.create);
routes.put("/lista-espera", ListaController.delete);
routes.put("/lista-espera", ListaController.update);
routes.get("/equipamento", EquipamentoController.index);
routes.get("/equipamento-liberado", EquipamentoController.indexSerie);
routes.post("/equipamento", EquipamentoController.create);
routes.put("/equipamento", EquipamentoController.update);
routes.get("/equipamento-inativo", EquipamentoController.indexInativo);
routes.get("/equipamento-manutencao", EquipamentoController.indexManutencao);
routes.get("/equipamento-devolucao", EquipamentoController.returnEquipment);
routes.get("/bateria", BateriaController.index);
routes.get("/bateria-liberado", BateriaController.indexSerieEstoque);
routes.post("/bateria", BateriaController.create);
routes.get("/bateria-inativo", BateriaController.indexInativo);
routes.get("/bateria-manutencao", BateriaController.indexManutencao);
routes.put("/bateria", BateriaController.update);
routes.get("/usuario-teste", UsuarioController.index);
routes.get("/usuario", UsuarioController.index);
routes.get("/usuario-ativo", UsuarioController.listUserActive);
routes.post("/usuario", UsuarioController.create);
routes.post("/activate-user", UsuarioController.activateUser);
routes.post("/desativar-user", UsuarioController.DesativarUser);
routes.post("/usuario-admin", UsuarioController.createADM);
routes.post("/usuario-admin-sem", UsuarioController.createADMNoPass);
routes.put("/usuario", UsuarioController.update);
routes.post("/usuario-senha", UsuarioController.sendRecoverPasswordemail);
routes.post("/usuario-email", UsuarioController.verificaEmail);
routes.put("/usuario-senha", UsuarioController.update_senha);
routes.put("/ativar-usuario", UsuarioController.updateAtivo);
routes.put("/troca-senha-usuario", UsuarioController.updateSenha);
routes.get("/usuario-cpf", UsuarioController.indexCPF);
routes.get("/autenticacao", UsuarioController.authenticate);
routes.get("/autenticacaosimples", UsuarioController.authenticatesimples);
routes.get("/funcionario", FuncionarioController.index);
routes.post("/funcionario", FuncionarioController.create);
routes.put("/funcionario", FuncionarioController.update);
routes.get("/funcionario-business", FuncionarioController.getLinkedBusiness);
routes.put("/funcionario-business", FuncionarioController.assignToBusiness);
routes.put("/funcionario-senha", FuncionarioController.update_senha);
routes.get("/autenticacao-funcionario", FuncionarioController.authenticate);
routes.get("/parceiro", ParceiroController.index);
routes.get("/parceiro-equipamento", ParceiroController.indexComEquipamentos);
routes.post("/parceiro", ParceiroController.create);
routes.put("/parceiro", ParceiroController.update);
routes.put("/parceiro-senha", ParceiroController.update_senha);
routes.get("/parceiro-lista", ParceiroController.indexParceiros);
routes.get("/autenticacao-parceiro", ParceiroController.authenticate);
routes.get("/solicitacao", SolicitacaoController.index);
routes.get("/completosolicitacao-", SolicitacaoController.indexTotal);
routes.get("/solicitacao-andamento", SolicitacaoController.index);
routes.get("/solicitacao/:campo", SolicitacaoController.index);
routes.post("/solicitacao", SolicitacaoController.create);
routes.put("/solicitacao", SolicitacaoController.update);
routes.get("/estoque", EstoqueController.index);
routes.get("/estoque/:kit", EstoqueController.index);
routes.get("/estoque-completo", EstoqueController.indexTotal);
routes.get("/estoque-completo/:kit", EstoqueController.indexTotal);
routes.post("/estoque", EstoqueController.create);
routes.put("/estoque", EstoqueController.update);
routes.put("/estoque-check", EstoqueController.updatecheck);
routes.put("/estoque-generico", EstoqueController.updateGenerico);
routes.put("/estoque-completo", EstoqueController.updateTotal);
routes.delete("/estoque", EstoqueController.delete);
routes.delete("/estoque-desmontar", EstoqueController.desmontarKit);
routes.get("/estoque-inativo", EstoqueController.indexInativo);
routes.get("/estoque-manutencao", EstoqueController.indexManutencao);
routes.get("/estoque-manutencao/:kit", EstoqueController.indexManutencao);
routes.put("/resolver-emergencia", EstoqueController.resolverEmergencia);
routes.get("/estoque-emergencia", EstoqueController.indexEmergencia);
routes.put("/estoque-emergencia", EstoqueController.updateEmergencia);
routes.get("/estoque-reservado", EstoqueController.indexReservado);
routes.post("/estoque-reservado", EstoqueController.reservarEquipamento);
routes.put("/estoque-reservado", EstoqueController.cancelarReserva);
routes.put("/estoque-reservado-prolongar", EstoqueController.prolongarReserva);
routes.get("/lesao", LesaoController.index);
routes.get("/status", StatusController.index);
routes.get("/funcionario-admin", FuncionarioController.indexAdmin);
routes.get("/videos", VideoController.index);
routes.post("/imageUp", ImageUp.index);
// Panico
routes.put("/panic", EstoqueController.emitPanic);

// Mapa
routes.get(
  "/equipamento-uso-mapa",
  GeolocalizacaoController.getInUseEquipments
);
routes.get("/parceiro-mapa", GeolocalizacaoController.getParceirosInMap);
routes.post("/teste-geolocalizacao", GeolocalizacaoController.movimentTest);
routes.get("/teste-posicao", GeolocalizacaoController.positionTest);

// Teste Stripe:
routes.get("/stripe-test", async (req, res) => {
  const paymentIntent = await createPaymentIntent(req.query.cliente);

  if (paymentIntent != null) {
    // console.log(paymentIntent);
    res.status(200).json(paymentIntent);
  } else {
    const errorJson = {
      message: "error",
    };
    res.status(500).json(errorJson);
  }
});

routes.get("/mapa", (req, res) => {
  console.log("Enviando o maps");
  res.sendFile(path.resolve(__dirname, "../web/index.html"));
});

// Limpar Banco (NAO ENVIAR PARA PRODUCAO)
routes.delete("/limpar-tudo", UsuarioController.limparTudo);



const db = require("./Senha/db");
const { createPaymentIntent } = require("./config/stripe");



module.exports = routes;
