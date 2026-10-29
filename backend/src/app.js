require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/tramites.routes');
const { manejarErrores } = require('./middlewares/errors');
const app = express();
app.use(cors({ origin:process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/tramites',routes);
app.use((err,req,res,next) => {
  if (err.status) return res.status(err.status).json({ error:err.message });
  manejarErrores(err,req,res,next);
});
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log('API iniciada'));
module.exports = app;
