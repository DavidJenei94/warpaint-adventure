const packingitem = require('../services/packingitem.service');

async function getAll(req, res, next) {
  try {
    res.status(200).json(await packingitem.getAll(req.params.listId));
  } catch (err) {
    console.error(
      `Error while getting all packing items from a list:`,
      err.message
    );
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(200).json(await packingitem.create(req.body, req.params.listId));
  } catch (err) {
    console.error(`Error while creating packing item:`, err.message);
    next(err);
  }
}

async function updateAll(req, res, next) {
  try {
    res.status(200).json(await packingitem.updateAll(req.body.status, req.params.listId));
  } catch (err) {
    console.error(`Error while updating packing items:`, err.message);
    next(err);
  }
}

async function get(req, res, next) {
  try {
    res.status(200).json(await packingitem.get(req.params.id));
  } catch (err) {
    console.error(`Error while get a single packing list:`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.status(200).json(await packingitem.update(req.body, req.params.id));
  } catch (err) {
    console.error(`Error while updating packing list:`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.status(200).json(await packingitem.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting packing list:`, err.message);
    next(err);
  }
}

module.exports = {
  getAll,
  create,
  updateAll,
  get,
  update,
  remove,
};
