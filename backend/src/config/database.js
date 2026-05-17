const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const databaseUrl =
  process.env.DATABASE_PUBLIC_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  buildPostgresUrlFromSpringStyleEnv();

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: Number(process.env.DB_POOL_MAX || 3),
    min: Number(process.env.DB_POOL_MIN || 0),
    acquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
    idle: Number(process.env.DB_POOL_IDLE || 10000)
  },
  dialectOptions: process.env.DB_SSL === 'false'
    ? {}
    : {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
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
