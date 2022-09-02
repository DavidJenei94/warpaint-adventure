const express = require('express');
const router = express.Router();
const packingitemController = require('../controllers/packingitem.controller');
const verifyPackingList = require('../middlewares/packingList');

router.get('/:listId/packingitem/', verifyPackingList, packingitemController.getAll);
router.post('/:listId/packingitem/', verifyPackingList, packingitemController.create);
router.get('/:listId/packingitem/:id', verifyPackingList, packingitemController.get);
router.put('/:listId/packingitem/:id', verifyPackingList, packingitemController.update);
router.delete('/:listId/packingitem/:id', verifyPackingList, packingitemController.remove);

module.exports = router;
