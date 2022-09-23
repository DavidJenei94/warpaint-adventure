const express = require('express');
const router = express.Router();
const gpxGeoJsonController = require('../controllers/gpxGeoJson.controller');

// router.get('/', packinglistController.getAll);
router.post('/import', gpxGeoJsonController.importGpx);
router.post('/export', gpxGeoJsonController.exportGpx);
// router.get('/:listId', verifyPackingList, packinglistController.get);
// router.put('/:listId', verifyPackingList, packinglistController.update);
// router.delete('/:listId', verifyPackingList, packinglistController.remove);

module.exports = router;
