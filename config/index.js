require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
  },
  cache: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  loader: {
    key: process.env.LOADER_IO_KEY
  }
};