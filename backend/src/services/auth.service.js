const bcrypt = require('bcryptjs');
const db = require('./db.service');
const config = require('../configs/general.config');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const HttpError = require('../utils/HttpError');
const validateEmail = require('../utils/general.utils');

const login = async (user) => {
  // Validate user input
  if (!(user.email && user.password)) {
    throw new HttpError('All input is required.', 400);
  }

  // Validate if user exist in our database
  const dbUser = await db
    .query(`SELECT * FROM Users WHERE email=?`, [user.email])
    .then((data) => {
      if (data.length === 0) {
        throw new HttpError('User does not exist.', 401);
      }

      const userData = data[0];

      return new User(
        userData.ID,
        userData.Email,
        userData.Password,
        userData.Name,
        userData.Role,
        userData.PremiumEndDate,
        userData.PremiumRecurring,
        userData.Created
      );
    })
    .catch((err) => {
      throw err;
    });

  if (dbUser && (await bcrypt.compare(user.password, dbUser.password))) {
    // Create token
    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email },
      config.tokenKey,
      {
        expiresIn: config.loginExpiresIn,
      }
    );

    // save user token
    dbUser.token = token;

    return {
      message: 'Successful login.',
      user: {
        id: dbUser.id,
        name: dbUser.name,
        premiumEndDate: dbUser.premiumEndDate,
        premiumRecurring: dbUser.premiumRecurring,
        token: dbUser.token,
        expiresIn: config.loginExpiresIn,
      },
    };
  }

  throw new HttpError('Wrong Email or Password.', 401);
};

const signup = async (user) => {
  if (user.password.length < 8) {
    throw new HttpError('Password must be at least 8 characters long.', 400);
  }

  if (!validateEmail(user.email)) {
    throw new HttpError('Not an acceptable email format.', 400);
  }

  if (user.name.trim() === "") {
    throw new HttpError('Name cannot be empty.', 400);
  }

  // Validate if user email already exists
  await db
    .query(`SELECT * FROM Users WHERE email=?`, [user.email])
    .then((data) => {
      if (data.length !== 0) {
        throw new HttpError('User already exists.', 400);
      }

      return data[0];
    })
    .catch((err) => {
      throw err;
    });

  const pwdHash = await bcrypt.hash(user.password, config.saltRounds);
  const result = await db.query(
    `INSERT INTO Users
    (Email, Password, Name)
    VALUES
    (?)`,
    [[user.email, pwdHash, user.name]]
  );

  if (!result.affectedRows) {
    throw new HttpError('Error in creating user.', 400);
  }

  const userId = result.insertId.toString();
  user.id = userId;

  const token = jwt.sign({ id: userId, email: user.email }, config.tokenKey, {
    expiresIn: config.loginExpiresIn,
  });
  user.token = token;

  // return new user
  return { message: 'User created successfully.', user };
};

const refresh = async (token) => {
  const decodedToken = jwt.verify(token, config.tokenKey);

  // Validate if user already exists
  const userId = decodedToken.id;
  const dbUser = await db
    .query(`SELECT * FROM Users WHERE id=?`, [userId])
    .then((data) => {
      if (data.length === 0) {
        throw new HttpError('User does not exists.', 401);
      }

      return data[0];
    })
    .catch((err) => {
      throw err;
    });

  const newToken = jwt.sign(
    { id: userId, email: dbUser.Email },
    config.tokenKey,
    {
      expiresIn: config.loginExpiresIn,
    }
  );

  return {
    message: 'User token refreshed.',
    user: {
      token: newToken,
      expiresIn: config.loginExpiresIn,
    },
  };
};

module.exports = {
  login,
  signup,
  refresh,
};
