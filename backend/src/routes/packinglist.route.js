const express = require('express');
const router = express.Router();
const packinglistController = require('../controllers/packinglist.controller');
const verifyPackingList = require('../middlewares/packingList');

router.get('/', packinglistController.getAll);
router.post('/', packinglistController.create);
router.get('/:listId', verifyPackingList, packinglistController.get);
router.put('/:listId', verifyPackingList, packinglistController.update);
router.delete('/:listId', verifyPackingList, packinglistController.remove);

module.exports = router;
