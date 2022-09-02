const packinglist = require('../services/packinglist.service');

async function getAll(req, res, next) {
  try {
    res.status(200).json(await packinglist.getAll(req.user));
  } catch (err) {
    console.error(`Error while getting all packing list:`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(200).json(await packinglist.create(req.user, req.body));
  } catch (err) {
    console.error(`Error while creating packing list:`, err.message);
    next(err);
  }
}

async function get(req, res, next) {
  try {
    res.status(200).json(await packinglist.get(req.params.listId));
  } catch (err) {
    console.error(`Error while get a single packing list:`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.status(200).json(await packinglist.update(req.body, req.params.listId));
  } catch (err) {
    console.error(`Error while updating packing list:`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.status(200).json(await packinglist.remove(req.params.listId));
  } catch (err) {
    console.error(`Error while deleting packing list:`, err.message);
    next(err);
  }
}

module.exports = {
  getAll,
  create,
  get,
  update,
  remove,
};
