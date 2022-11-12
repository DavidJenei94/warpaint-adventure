const bcrypt = require('bcryptjs');
const db = require('../models/index');
const config = require('../configs/general.config');
const HttpError = require('../utils/HttpError');

const User = db.models.User;

const get = async () => {
  const dbUsers = await User.findAll();

  return dbUsers;
};

const create = async (user) => {
  const pwdHash = await bcrypt.hash(user.Password, config.saltRounds);

  const dbUser = await User.create({
    email: user.Email,
    password: pwdHash,
    name: user.Name,
  });

  if (!dbUser) {
    throw new HttpError('Error in creating user.', 400);
  }

  return {message: 'User created successfully', userId: dbUser.id};
};

const getSingle = async (userId) => {
  const dbUser = await User.findByPk(userId)

  return dbUser;
};

const update = async (id, user) => {
  const dbUser = await User.update({email: user.email, name: user.name, role: user.role}, {where: {id: id}})

  if (!dbUser || dbUser[0] === 0) {
    throw new HttpError('Error in updating user.', 400);
  }

  return { message: 'User updated successfully' };
};

const remove = async (id) => {
  const dbUser = await User.destroy({ where: { id: id } });

  if (!dbUser) {
    throw new HttpError('User does not exist or cannot be deleted.', 400);
  }

  return { message: 'User deleted successfully' };
};

module.exports = {
  get,
  create,
  getSingle,
  update,
  remove,
};
