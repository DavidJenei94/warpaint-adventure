const db = require('../models/index');
const HttpError = require('../utils/HttpError');

const PackingList = db.models.PackingList;

const verifyPackingList = async (req, res, next) => {
  const user = req.user;
  const listId = req.params.listId;

  try {
    const dbPackingList = await PackingList.findOne({
      attributes: ['userId'],
      where: { id: listId, userId: user.id },
    });

    if (!dbPackingList || user.id !== dbPackingList.userId) {
      throw new HttpError('User has no access to this packing list.', 401);
    }

    next();
  } catch (err) {
    console.error(`Error while validating user for packing list:`, err.message);
    next(err);
  }
};

module.exports = verifyPackingList;
