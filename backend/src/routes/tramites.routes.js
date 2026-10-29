const router = require('express').Router();
const controller = require('../controllers/tramites.controller');
const { autenticar, autorizar } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errors');
router.use(autenticar);
router.post('/', asyncHandler(controller.crear));
router.get('/', asyncHandler(controller.listar));
router.patch('/:id/estatus', autorizar('admin','supervisor'), asyncHandler(controller.cambiarEstatus));
module.exports = router;
