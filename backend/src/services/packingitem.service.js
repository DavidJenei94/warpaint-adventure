const db = require('../models/index');
const HttpError = require('../utils/HttpError');

const PackingItem = db.models.PackingItem;
const PackingList = db.models.PackingList;

const getAll = async (listId) => {
  const dbPackingList = await PackingList.findAll({
    where: { id: listId },
    include: [
      {
        model: PackingItem,
        required: true,
        attributes: ['id', 'name', 'status'],
      },
    ],
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  const message = 'Packing items are selected!';

  if (!dbPackingList || dbPackingList.length === 0) {
    return { message, packingItems: [] };
  }

  if (!Array.isArray(dbPackingList)) {
    return { message, packingItems: [dbPackingList[0].PackingItems] };
  }

  return { message, packingItems: dbPackingList[0].PackingItems };
};

const create = async (packingItem, listId) => {
  const dbPackingItem = await PackingItem.create({
    packingListId: listId,
    name: packingItem.name,
  });

  if (!dbPackingItem) {
    throw new HttpError('Error in creating new packing item.', 400);
  }

  return {
    message: 'New packing item created!',
    packingItemId: dbPackingItem.id,
  };
};

const updateAll = async (packingItemNewStatus, listId) => {
  const dbPackingItem = await PackingItem.update(
    { status: packingItemNewStatus },
    { where: { packingListId: listId } }
  );

  if (!dbPackingItem || dbPackingItem[0] === 0) {
    throw new HttpError('Error in updating all packing items.', 400);
  }

  return { message: 'Packing items are updated!' };
};

const get = async (itemId) => {
  const dbPackingItem = await PackingItem.findByPk(itemId, {
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  if (!dbPackingItem) {
    throw new HttpError('Packing item does not exists.', 400);
  }

  return { packingItem: dbPackingItem };
};

const update = async (packingItem, itemId) => {
  if (!packingItem.name || isNaN(packingItem.status)) {
    throw new HttpError('Wrong parameters for the packing item are sent.', 400);
  }

  const dbPackingItem = await PackingItem.update(
    { name: packingItem.name, status: packingItem.status },
    {
      where: { id: itemId },
    }
  );

  if (!dbPackingItem || dbPackingItem[0] === 0) {
    throw new HttpError('Packing item does not exists.', 400);
  }

  return {
    message: 'Packing item updated.',
    packingItem: {
      id: itemId,
      name: packingItem.name,
      status: packingItem.status,
    },
  };
};

const remove = async (itemId) => {
  const dbPackingItem = await PackingItem.destroy({ where: { id: itemId } });

  if (!dbPackingItem) {
    throw new HttpError('Packing item does not exists.', 400);
  }

  return { message: 'Packing item deleted.' };
};

module.exports = {
  getAll,
  create,
  updateAll,
  get,
  update,
  remove,
};
