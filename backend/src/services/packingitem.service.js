const db = require('./db.service');
const packinglist = require('../services/packinglist.service');
const HttpError = require('../utils/HttpError');

const getAll = async (listId) => {
  const result = await db.query(
    `SELECT PackingItem.ID AS id, PackingItem.Name AS name, PackingItem.Status AS status 
    FROM PackingList 
    JOIN PackingItem WHERE PackingList.ID = PackingItem.PackingListID 
    AND PackingList.ID = ?;`,
    [listId]
  );

  return { message: 'Packing items are selected!', packingItems: result };
};

const create = async (packingItem, listId) => {
  const result = await db.query(
    `INSERT INTO PackingItem (PackingListID, Name, Status) VALUES (?);`,
    [[listId, packingItem.name, 0]]
  );

  if (!result.affectedRows) {
    throw new HttpError('Error in creating new packing item.', 400);
  }

  const packingItemId = result.insertId.toString();
  return { message: 'New packing item created!', packingItemId };
};

const get = async (itemId) => {
  const result = (
    await db.query(
      `Select PackingItem.ID AS id, PackingItem.Name AS name, PackingItem.Status AS status
        FROM PackingList 
        JOIN PackingItem WHERE PackingList.ID = PackingItem.PackingListID 
        AND PackingItem.ID = ?;`,
      [itemId]
    )
  )[0];

  if (!result) {
    throw new HttpError('Packing item does not exists.', 400);
  }

  return { packingItem: result };
};

const update = async (packingList, itemId) => {
  if (!packingList.name || isNaN(packingList.status)) {
    throw new HttpError('Wrong parameters for the packing item are sent.', 400);
  }

  const result = await db.query(
    `UPDATE PackingItem
    SET Name = ?, Status = ?
    WHERE ID = ?;`,
    [packingList.name, packingList.status, itemId]
  );

  if (!result.affectedRows) {
    throw new HttpError('Packing item does not exists.', 400);
  }

  return { message: 'Packing item updated.' };
};

const remove = async (itemId) => {
  const result = await db.query(`DELETE FROM PackingItem WHERE ID = ?;`, [
    itemId,
  ]);

  if (!result.affectedRows) {
    throw new HttpError('Packing item does not exists.', 400);
  }

  return { message: 'Packing item deleted.' };
};

module.exports = {
  getAll,
  create,
  get,
  update,
  remove,
};
