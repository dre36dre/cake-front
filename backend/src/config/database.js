const { Sequelize } = require('sequelize');
require('dotenv').config();

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  buildPostgresUrlFromSpringStyleEnv();

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  dialectOptions: process.env.DB_SSL === 'true'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
});

module.exports = sequelize;

function buildPostgresUrlFromSpringStyleEnv() {
  const host = process.env.PGHOST || 'localhost';
  const port = process.env.PGPORT || '5432';
  const database = process.env.PGDATABASE || 'confeitaria';
  const user = encodeURIComponent(process.env.PGUSER || 'postgres');
  const password = encodeURIComponent(process.env.PGPASSWORD || 'postgres');

  return `postgres://${user}:${password}@${host}:${port}/${database}`;
}
