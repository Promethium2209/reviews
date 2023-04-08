const { Pool } = require('pg');
const config = require('../config/index');

const dbConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  keepAlive: false
};

const pool = new Pool(dbConfig);

pool.on('error', err => {
  console.error(err);
  process.exit(-1);
})

module.exports = pool;