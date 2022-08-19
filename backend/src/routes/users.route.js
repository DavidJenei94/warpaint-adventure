const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

router.get('/', usersController.getAll);
router.post('/', usersController.create);
router.get('/:id', usersController.get);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.remove);

module.exports = router;