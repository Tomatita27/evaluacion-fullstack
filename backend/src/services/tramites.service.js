const model = require('../models/tramites.model');
const TIPOS = ['TRASPASO','RETIRO','CONSTANCIA'];
const ESTATUS = ['PENDIENTE','EN_PROCESO','CANCELADO','CONCLUIDO'];
const CURP = /^[A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM][A-Z]{2}[B-DF-HJ-NP-TV-Z]{3}[A-Z0-9]\d$/;
function fallo(codigo, mensaje) { const err = new Error(mensaje); err.status = codigo; throw err; }
async function crear(body, usuario) {
  const curp = typeof body.curp === 'string' ? body.curp.trim().toUpperCase() : '';
  if (!CURP.test(curp)) fallo(400, 'CURP inválida: debe tener 18 caracteres y formato válido');
  if (!TIPOS.includes(body.tipo)) fallo(400, 'Tipo inválido');
  let monto = null;
  if (body.monto !== undefined && body.monto !== null && body.monto !== '') {
    if (typeof body.monto !== 'number' || !Number.isFinite(body.monto) || body.monto < 0 || body.monto > 9999999999.99 || Math.round(body.monto*100) !== body.monto*100) {
      fallo(400, 'Monto inválido');
    }
    monto = body.monto;
  }
  return model.crear({ curp, tipo:body.tipo, monto, empleadoId:usuario.id });
}
function entero(valor, defecto, maximo) {
  if (valor === undefined) return defecto;
  if (!/^\d+$/.test(String(valor))) fallo(400, 'Los parámetros de paginación deben ser enteros positivos');
  const n = Number(valor);
  if (!Number.isSafeInteger(n) || n < 1) fallo(400, 'Los parámetros de paginación deben ser enteros positivos');
  return Math.min(n, maximo);
}
async function listar(query) {
  const pagina = entero(query.pagina,1,100000000);
  const porPagina = entero(query.porPagina,10,100);
  const estatus = query.estatus;
  if (estatus !== undefined && !ESTATUS.includes(estatus)) fallo(400, 'Filtro de estatus inválido');
  const resultado = await model.listar({ limit:porPagina, offset:(pagina-1)*porPagina, estatus });
  return { ...resultado, pagina, porPagina };
}
async function cambiarEstatus(id, estatus) {
  if (!/^\d+$/.test(String(id)) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) fallo(400, 'ID inválido');
  if (!ESTATUS.includes(estatus)) fallo(400, 'Estatus inválido');
  const actualizado = await model.actualizarSiAbierto(Number(id),estatus);
  if (actualizado) return actualizado;
  const existente = await model.buscarPorId(Number(id));
  if (!existente) fallo(404, 'Trámite no encontrado');
  fallo(409, 'El trámite está CANCELADO o CONCLUIDO y no puede cambiar');
}
module.exports = { crear, listar, cambiarEstatus };
