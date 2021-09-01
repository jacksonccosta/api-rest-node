const express = require('express');
const controladorContas = require('./controladores/contas');
const roteador = express();

roteador.get("/contas", controladorContas.consultarTodasAsContas);
roteador.post("/contas", controladorContas.criarConta);
roteador.put("/contas/:numeroConta", controladorContas.atualizarUsuarioConta);
roteador.delete("/contas/:numeroConta", controladorContas.excluirConta);

module.exports = roteador;