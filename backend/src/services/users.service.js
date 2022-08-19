const bcrypt = require('bcryptjs');
const db = require('./db.service');
const config = require('../configs/general.config');

/*
const hash = await bcrypt.hash('PASSWORD', config.saltRounds)
var sql = "INSERT INTO curd_table (first_name,last_name,username,password) VALUES ?";
var values = [[firstname,lastname,username,hash]]
const result = await bcrypt.compare('PASSWORD', hash)
*/

const get = async () => {
  return (rows = await db.query(`SELECT * FROM Users`));
};

const create = async (user) => {
  const pwdHash = await bcrypt.hash(user.Password, config.saltRounds);

  const result = await db.query(
    `INSERT INTO Users
    (Email, Password, Name)
    VALUES
    (?)`,
    [[user.Email, pwdHash, user.Name]]
  );

  let response = {
    userId: '',
    message: 'Error in creating user',
  };

  if (result.affectedRows) {
    response.userId = result.insertId.toString();
    response.message = 'User created successfully';
  }

  return response;
};

const getSingle = async (userId) => {
  const row = await db.query(`SELECT * FROM Users WHERE ID = ?`, [userId]);
  return row[0];
};

const update = async (id, user) => {
  const result = await db.query(
    `UPDATE Users
    SET Email=?, Name=?
    WHERE ID=?;`,
    [user.Email, user.Name, id]
  );

  let message = 'Error in updating user';
  if (result.affectedRows) {
    message = 'User updated successfully';
  }

  return { message };
};

const remove = async (id) => {
  const result = await db.query(`DELETE FROM Users WHERE id=?`, [id]);

  let message = 'Error in deleting user';
  if (result.affectedRows) {
    message = 'User deleted successfully';
  }

  return { message };
};

module.exports = {
  get,
  create,
  getSingle,
  update,
  remove,
};
