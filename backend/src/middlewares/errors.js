function manejarErrores(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
module.exports = { manejarErrores, asyncHandler };
