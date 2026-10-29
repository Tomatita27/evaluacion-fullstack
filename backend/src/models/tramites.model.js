const pool = require('../db/connection');
async function crear(data) {
  const { rows } = await pool.query(
    `INSERT INTO tramites (curp,tipo,monto,empleado_id) VALUES ($1,$2,$3,$4) RETURNING *`,
    [data.curp,data.tipo,data.monto,data.empleadoId]
  );
  return rows[0];
}
async function listar({ limit, offset, estatus }) {
  const where = estatus ? 'WHERE estatus = $1' : '';
  const filtros = estatus ? [estatus] : [];
  const { rows: [{ total }] } = await pool.query(`SELECT COUNT(*)::int AS total FROM tramites ${where}`, filtros);
  const { rows } = await pool.query(
    `SELECT * FROM tramites ${where} ORDER BY creado_en DESC, id DESC LIMIT $${filtros.length+1} OFFSET $${filtros.length+2}`,
    [...filtros,limit,offset]
  );
  return { filas: rows, total };
}
async function actualizarSiAbierto(id, estatus) {
  const { rows } = await pool.query(
    `UPDATE tramites SET estatus = $2 WHERE id = $1 AND estatus NOT IN ('CANCELADO','CONCLUIDO') RETURNING *`,
    [id, estatus]
  );
  return rows[0] || null;
}
async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT id, estatus FROM tramites WHERE id = $1', [id]);
  return rows[0] || null;
}
module.exports = { crear, listar, actualizarSiAbierto, buscarPorId };
