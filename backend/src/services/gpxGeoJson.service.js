const gpxParser = require('gpxparser');
var togpx = require('togpx');
const HttpError = require('../utils/HttpError');

const importGpx = (gpxString) => {
  const gpx = new gpxParser(); //Create gpxParser Object
  gpx.parse(gpxString); //parse gpx file from string data
  const geoJSON = gpx.toGeoJSON();
  
  if (!geoJSON) {
    throw new HttpError('Can not convert selected file!');
  }

  return geoJSON;
};

const exportGpx = (geoJson) => {
  const gpxString = togpx(geoJson);

  if (!gpxString) {
    throw new HttpError('Can not convert route!');
  }

  return gpxString;
};

module.exports = {
  importGpx,
  exportGpx,
};
