const auth = require('../services/auth.service');

async function login(req, res, next) {
  try {
    res.status(200).json(await auth.login(req.body));
  } catch (err) {
    console.error(`Error while logging in:`, err.message);
    next(err);
  }
}

async function signup(req, res, next) {
  try {
    res.status(200).json(await auth.signup(req.body));
  } catch (err) {
    console.error(`Error while Signing up:`, err.message);
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    res.status(200).json(await auth.refresh(req.body.token));
  } catch (err) {
    console.error(`Error while refreshing token:`, err.message);
    next(err);
  }
}

module.exports = {
  login,
  signup,
  refresh,
};
