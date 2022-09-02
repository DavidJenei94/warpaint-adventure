const jwt = require('jsonwebtoken');
const db = require('./db.service');
const config = require('../configs/general.config');
const HttpError = require('../utils/HttpError');

const getAll = async (user) => {
  const result = await db.query(`SELECT * FROM PackingList WHERE UserID = ?;`, [
    user.id,
  ]);

  return { message: 'Packing lists are selected!', packingLists: result };
};

const create = async (user, packingList) => {
  const result = await db.query(
    `INSERT INTO PackingList (UserID, Name) VALUES (?);`,
    [[user.id, packingList.name]]
  );

  if (!result.affectedRows) {
    throw new HttpError('Error in creating new packing list.', 400);
  }

  const packingListId = result.insertId.toString();
  return { message: 'New packing list created!', packingListId };
};

const get = async (packingListID) => {
  const result = (
    await db.query('Select * FROM PackingList WHERE ID = ? ;', [packingListID])
  )[0];

  if (!result) {
    throw new HttpError('Packing list does not exist.', 400);
  }

  return { message: 'Packing list is selected!', packingList: result };
};

const update = async (packingList, packingListID) => {
  const result = await db.query(
    `UPDATE PackingList
    SET Name = ?
    WHERE ID = ?;`,
    [packingList.name, packingListID]
  );

  if (!result.affectedRows) {
    throw new HttpError('Packing list does not exist.', 400);
  }

  return { message: 'Packing List updated.' };
};

const remove = async (packingListID) => {
  const result = await db.query(`DELETE FROM PackingList WHERE ID = ?;`, [
    packingListID,
  ]);

  if (!result.affectedRows) {
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
