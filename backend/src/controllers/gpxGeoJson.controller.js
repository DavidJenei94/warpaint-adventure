const gpxGeoJson = require('../services/gpxGeoJson.service');

const importGpx = async (req, res, next) => {
  try {
    res.status(200).json(await gpxGeoJson.importGpx(req.body.gpxString));
  } catch (err) {
    console.error(`Error while updating packing list:`, err.message);
    next(err);
  }
};

const exportGpx = async (req, res, next) => {
  try {
    res.status(200).json(await gpxGeoJson.exportGpx(req.body.geoJson));
  } catch (err) {
    console.error(`Error while deleting packing list:`, err.message);
    next(err);
  }
};

module.exports = {
  importGpx,
  exportGpx,
};
