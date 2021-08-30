const express = require('express');
const controladorContas = require('./controladores/contas');
const roteador = express();

roteador.get("/contas", controladorContas.consultarTodasAsContas);
roteador.post("/contas", controladorContas.criarConta);

module.exports = roteador;