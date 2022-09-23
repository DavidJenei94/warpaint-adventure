const route = require('../services/route.service');

const getAll = async (req, res, next) => {
  try {
    res.status(200).json(await route.getAll(req.user));
  } catch (err) {
    console.error(`Error while getting all routes:`, err.message);
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    res.status(200).json(await route.create(req.user, req.body.route, req.body.geoJson));
  } catch (err) {
    console.error(`Error while creating route:`, err.message);
    next(err);
  }
};

const get = async (req, res, next) => {
  try {
    res.status(200).json(await route.get(req.params.routeId));
  } catch (err) {
    console.error(`Error while getting route:`, err.message);
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    res.status(200).json(await route.update(req.params.routeId, req.body.route, req.body.geoJson));
  } catch (err) {
    console.error(`Error while updateing route:`, err.message);
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    res.status(200).json(await route.remove(req.params.routeId, req.body.routePath));
  } catch (err) {
    console.error(`Error while removing route:`, err.message);
    next(err);
  }
};

module.exports = {
  getAll,
  create,
  get,
  update,
  remove,
};
