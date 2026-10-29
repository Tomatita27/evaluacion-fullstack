const jwt = require('jsonwebtoken');
function autenticar(req, res, next) {
  const match = /^Bearer (.+)$/i.exec(req.headers.authorization || '');
  if (!match) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!Number.isInteger(payload.id) || !['admin','supervisor','empleado'].includes(payload.rol)) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.usuario = { id: payload.id, rol: payload.rol };
    next();
  } catch (_) { return res.status(401).json({ error: 'Token inválido o expirado' }); }
}
function autorizar(...roles) {
  return (req, res, next) => roles.includes(req.usuario?.rol)
    ? next() : res.status(403).json({ error: 'Sin permisos' });
}
module.exports = { autenticar, autorizar };
