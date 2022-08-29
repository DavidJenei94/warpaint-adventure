const general = {
  saltRounds: 10,
  tokenKey: process.env.TOKEN_KEY,
  loginExpiresIn: 2 * 60 * 60, //in seconds
};

module.exports = general;
