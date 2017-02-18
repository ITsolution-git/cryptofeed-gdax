var dotenv = require('dotenv').load();

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DEV_DB_HOST,
      database: process.env.DEV_DB_NAME,
      user:     process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD
    },
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds'
    }
  },
  test: {
    client: 'mysql',
    connection: {
      host: process.env.TEST_DB_HOST,
      database: process.env.TEST_DB_NAME,
      user:     process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD
    },
    migrations: {
      directory: __dirname + '/src/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/db/seeds'
    }
  }
};
