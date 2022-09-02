const db = require('../services/db.service');
const HttpError = require('../utils/HttpError');

const verifyPackingList = async (req, res, next) => {
  const user = req.user;
  const listId = req.params.listId;

  try {
    const result = (
      await db.query('Select UserID FROM PackingList WHERE ID = ? AND UserID = ?;', [
        listId,
        user.id,
      ])
    )[0];

    if (!result || user.id !== result.UserID) {
      throw new HttpError('User has no access to this packing list.', 401);
    }

    next();
  } catch (err) {
    console.error(`Error while validating user for packing list:`, err.message);
    next(err);
  }
};

module.exports = verifyPackingList;
