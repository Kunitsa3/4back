module.exports = {
  HOST: process.env.CLEARDB_DATABASE_HOST || 'localhost',
  USER: process.env.CLEARDB_DATABASE_USER || 'root',
  PASSWORD: process.env.CLEARDB_DATABASE_PASSWORD || 'root',
  DB: process.env.CLEARDB_DATABASE_DB || 'testdb',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
