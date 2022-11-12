const bcrypt = require('bcryptjs');
const db = require('../models/index');
const config = require('../configs/general.config');

const jwt = require('jsonwebtoken');
// const User = require('../models/user');
const HttpError = require('../utils/HttpError');
const validateEmail = require('../utils/general.utils');

const User = db.models.User;

const login = async (user) => {
  // Validate user input
  if (!(user.email && user.password)) {
    throw new HttpError('All input is required.', 400);
  }

  // Validate if user exist in our database
  const dbUser = await User.findOne({where: { email: user.email }})
  if (!dbUser) {
    throw new HttpError('User does not exist.', 401);
  }

  if (dbUser && (await bcrypt.compare(user.password, dbUser.password))) {
    // Create token
    const token = jwt.sign(
      { id: dbUser.id, email: dbUser.email, role: dbUser.role },
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
  const existingUser = await User.findOne({
    where: { email: user.email },
  });

  if (existingUser) {
    throw new HttpError('User already exists.', 400);
  }

  const pwdHash = await bcrypt.hash(user.password, config.saltRounds);
  const newUser = await User.create({
    email: user.email,
    password: pwdHash,
    name: user.name,
  });

  if (!newUser) {
    throw new HttpError('Error in creating user.', 400);
  }

  const userId = newUser.id.toString();
  const token = jwt.sign({ id: userId, email: newUser.email, role: newUser.role }, config.tokenKey, {
    expiresIn: config.loginExpiresIn,
  });
  newUser.token = token;

  // return new user
  return { message: 'User created successfully.', newUser };
};

const refresh = async (token) => {
  const decodedToken = jwt.verify(token, config.tokenKey);

  // Validate if user already exists
  const userId = decodedToken.id;
  const dbUser = await User.findOne({where: { id: userId }})
  if (!dbUser) {
    throw new HttpError('User does not exist.', 401);
  }

  const newToken = jwt.sign(
    { id: userId, email: dbUser.email, role: dbUser.role },
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
