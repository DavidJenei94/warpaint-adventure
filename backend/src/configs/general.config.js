const general = {
  saltRounds: 10,
  tokenKey: process.env.TOKEN_KEY,
  loginExpiresIn: 2 * 24 * 60 * 60, //in seconds: 2*24*60*60 = 2 days
};

module.exports = general;
