const { Client } = require('pg');
const config = require('../config/index');

const dbConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.database,
  password: config.db.password,
  port: config.db.port,
  keepAlive: false
};

const testConfig = {
  user: config.db.user,
  host: config.db.host,
  database: config.db.test_db,
  password: config.db.password,
  port: config.db.port,
  keepAlive: false
};

// const client = new Client(dbConfig);
const client = new Client(testConfig);

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err);
  } else {
    console.log('Connected to PostgreSQL');
  }
});

module.exports = client;