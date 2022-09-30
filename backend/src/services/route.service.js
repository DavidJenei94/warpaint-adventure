const fs = require('fs');
const db = require('./db.service');

const HttpError = require('../utils/HttpError');
const Route = require('../models/Route');

const getAll = async (user) => {
  const result = await db.query(
    `SELECT ID AS id, Name AS name, Path as path, Color as color FROM Route WHERE UserID = ?`,
    [user.id]
  );

  const routes = result.map(
    (route) => new Route(route.id, route.name, route.path, route.color)
  );

  return routes;
};

const create = async (user, route, geoJson) => {

  if (!route.name) {
    throw new HttpError('Route has no name.', 400);
  }

  if (!geoJson || geoJson.features[0].geometry.coordinates.length === 0) {
    throw new HttpError('No route is drawn on map.', 400);
  }

  const geoJsonString = JSON.stringify(geoJson);
  const path = `./src/uploads/routes/${user.id}-${Date.now()}.geojson`;

  fs.writeFile(path, geoJsonString, (error) => {
    if (error) {
      throw new HttpError('Error in creating new Route.', 400);
    }
  });

  const result = await db.query(
    `INSERT INTO Route (UserID, Name, Path, Color) VALUES (?);`,
    [[user.id, route.name, path, route.color]]
  );

  if (!result.affectedRows) {
    throw new HttpError('Error in creating new Route.', 400);
  }

  const routeId = result.insertId.toString();
  const newRoute = new Route(routeId, route.name, path, route.color);
  return {
    message: 'New route is created!',
    route: { ...newRoute },
  };
};

const get = async (routeId) => {
  const result = (
    await db.query(`SELECT * FROM Route WHERE ID = ?;`, [routeId])
  )[0];

  if (!result) {
    throw new HttpError('Route does not exist in the database.', 400);
  }

  const route = new Route(result.ID, result.Name, result.Path, result.Color);
  const geoJson = JSON.parse(fs.readFileSync(route.path, 'utf-8'));

  return { message: 'Route is selected!', route, geoJson };
};

const update = async (routeId, route, geoJson) => {
  if (route) {
    const result = await db.query(
      `UPDATE Route
      SET Name = ?, Color = ?
      WHERE ID = ?;`,
      [route.name, route.color, routeId]
    );
  }

  if (route && geoJson && geoJson.features.length !== 0) {
    const geoJsonString = JSON.stringify(geoJson);
    const path = route.path;

    fs.writeFile(path, geoJsonString, (error) => {
      if (error) {
        throw new HttpError('Error in updateing route.', 400);
      }
    });
  }

  return { message: 'Route is updated!' };
};

const remove = async (routeId, routePath) => {
  fs.unlink(routePath, (error) => {
    if (error)
      throw new HttpError('Route does not exist or cannot be deleted.', 400);
  });

  const result = await db.query(`DELETE FROM Route WHERE ID = ?;`, [routeId]);

  if (!result.affectedRows) {
    throw new HttpError('Route does not exist or cannot be deleted..', 400);
  }

  return { message: 'Route deleted.' };
};

module.exports = {
  getAll,
  create,
  get,
  update,
  remove,
};
