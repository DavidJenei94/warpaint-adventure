const db = require('../models/index');
const HttpError = require('../utils/HttpError');

const PackingList = db.models.PackingList;

const getAll = async (user) => {
  const dbPackingLists = await PackingList.findAll({
    where: { userId: user.id },
  });

  const message = 'Packing lists are selected!'

  if (!dbPackingLists) {
    return {message, packingLists: []};
  }
  
  if (!Array.isArray(dbPackingLists)) {
    return {message, packingLists: [dbPackingLists]};
  }

  return { message, packingLists: dbPackingLists };
};

const create = async (user, packingList) => {
  const dbPackingList = await PackingList.create({
    userId: user.id,
    name: packingList.name,
  });

  if (!dbPackingList) {
    throw new HttpError('Error in creating new packing list.', 400);
  }

  return {
    message: 'New packing list created!',
    packingListId: dbPackingList.id,
  };
};

const get = async (packingListID) => {
  const dbPackingList = await PackingList.findByPk(packingListID);

  if (!dbPackingList) {
    throw new HttpError('Packing list does not exist.', 400);
  }

  return { message: 'Packing list is selected!', packingList: dbPackingList };
};

const update = async (packingList, packingListId) => {
  const dbPackingList = await PackingList.update(
    { name: packingList.name },
    { where: { id: packingListId } }
  );

  if (!dbPackingList || dbPackingList[0] === 0) {
    throw new HttpError('Packing list does not exist.', 400);
  }

  return { message: 'Packing List updated.' };
};

const remove = async (packingListId) => {
  const dbPackingList = await PackingList.destroy({
    where: { id: packingListId },
  });

  if (!dbPackingList) {
    throw new HttpError('Packing list does not exist.', 400);
  }

  return { message: 'Packing list deleted.' };
};

module.exports = {
  getAll,
  create,
  get,
  update,
  remove,
};
