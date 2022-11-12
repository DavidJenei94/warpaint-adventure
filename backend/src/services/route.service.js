const fs = require('fs');
const db = require('../models/index');

const HttpError = require('../utils/HttpError');

const Route = db.models.Route;

const getAll = async (user) => {
  const dbRoutes = await Route.findAll({
    where: { userId: user.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!dbRoutes) {
    return [];
  }

  if (!Array.isArray(dbRoutes)) {
    return [dbRoutes];
  }

  return dbRoutes;
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

  const dbRoute = await Route.create({
    userId: user.id,
    name: route.name,
    path: path,
    color: route.color,
  });

  if (!dbRoute) {
    throw new HttpError('Error in creating new Route.', 400);
  }

  return {
    message: 'New route is created!',
    route: dbRoute,
  };
};

const get = async (routeId) => {
  const dbRoute = await Route.findByPk(routeId, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!dbRoute) {
    throw new HttpError('Route does not exist in the database.', 400);
  }

  const geoJson = JSON.parse(fs.readFileSync(dbRoute.path, 'utf-8'));

  return {
    message: 'Route is selected!',
    route: dbRoute,
    geoJson,
  };
};

const update = async (routeId, route, geoJson) => {
  if (route) {
    const dbRoute = await Route.update(
      { name: route.name, color: route.color },
      { where: { id: routeId } }
    );

    if (!dbRoute || dbRoute[0] === 0) {
      throw new HttpError('Error in updating route.', 400);
    }
  }

  if (route && geoJson && geoJson.features.length !== 0) {
    const geoJsonString = JSON.stringify(geoJson);
    const path = route.path;

    fs.writeFile(path, geoJsonString, (error) => {
      if (error) {
        throw new HttpError('Error in updating route.', 400);
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

  const dbRoute = await Route.destroy({ where: { id: routeId } });

  if (!dbRoute) {
    throw new HttpError('Route does not exist or cannot be deleted.', 400);
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
