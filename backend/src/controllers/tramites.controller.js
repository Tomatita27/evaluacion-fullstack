const service = require('../services/tramites.service');
async function crear(req,res) { res.status(201).json(await service.crear(req.body,req.usuario)); }
async function listar(req,res) { res.json(await service.listar(req.query)); }
async function cambiarEstatus(req,res) { res.json(await service.cambiarEstatus(req.params.id,req.body.estatus)); }
module.exports = { crear, listar, cambiarEstatus };
