const express = require('express');
const router = express.Router();
const routeController = require('../controllers/route.controller');

router.get('/', routeController.getAll);
router.post('/', routeController.create);
router.get('/:routeId', routeController.get);
router.put('/:routeId', routeController.update);
router.delete('/:routeId', routeController.remove);

module.exports = router;
