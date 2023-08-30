const express = require("express");

const {
  startTempo,
  stopTempo,
  historicoMes,
} = require("../controladores/index");

const rotas = express();

rotas.get("/entrada/:nomeUsuario", startTempo);

rotas.get("/saida/:nomeUsuario", stopTempo);

rotas.get("/historico/:nomeUsuario/:mes", historicoMes);

module.exports = { rotas };
