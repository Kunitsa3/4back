module.exports = {
  HOST: process.env.CLEARDB_DATABASE_URL || 'localhost',
  USER: process.env.CLEARDB_DATABASE_USER || 'root',
  PASSWORD: process.env.CLEARDB_DATABASE_PASSWORD || 'root',
  DB: 'testdb',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
