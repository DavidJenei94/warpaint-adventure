const mariadb = require('mariadb');
const dbConfig  = require('../configs/db.config');

const pool = mariadb.createPool(dbConfig);

const query = async (sql, params) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const results = await conn.query(sql, params);
    delete results.meta;
    return results;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.end();
  }
}

module.exports = {
  query
};
