const users = require('../services/users.service');

async function getAll(req, res, next) {
  try {
    res.json(await users.get());
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    res.status(200).json(await users.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
}

async function get(req, res, next) {
  try {
    res.json(await users.getSingle(req.params.id));
  } catch (err) {
    console.error(`Error while getting users`, err.message);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    res.json(await users.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    res.json(await users.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting user`, err.message);
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
