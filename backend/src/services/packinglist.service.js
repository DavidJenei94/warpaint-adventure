const jwt = require('jsonwebtoken');
const db = require('./db.service');
const config = require('../configs/general.config');
const HttpError = require('../utils/HttpError');
const PackingList = require('../models/PackingList');

const getAll = async (user) => {
  const result = await db.query(
    `SELECT ID AS id, Name AS name FROM PackingList WHERE UserID = ?;`,
    [user.id]
  );

  const packingLists = result.map(
    (packingList) => new PackingList(packingList.id, packingList.name)
  );

  return { message: 'Packing lists are selected!', packingLists };
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

  const packingList = new PackingList(result.ID, result.Name);

  return { message: 'Packing list is selected!', packingList };
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
