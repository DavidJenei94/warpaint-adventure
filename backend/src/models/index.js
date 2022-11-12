const Sequelize = require('sequelize');

const db = require('../configs/db.config');

const getUserModel = require('./user.model');
const getPackingListModel = require('./packinglist.model');
const getPackingItemModel = require('./packingitem.model');
const getRouteModel = require('./route.model');

const sequelize = new Sequelize(db.name, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  logging: false,
});

const models = {
  User: getUserModel(sequelize, Sequelize),
  PackingList: getPackingListModel(sequelize, Sequelize),
  PackingItem: getPackingItemModel(sequelize, Sequelize),
  Route: getRouteModel(sequelize, Sequelize),
};

// Associate models to each others
Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

module.exports = {
  models,
  sequelize,
};
