const { Sequelize } = require('sequelize');
const pg = require('pg');
require('dotenv').config();

const databaseUrl =
  process.env.DATABASE_PUBLIC_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  buildPostgresUrlFromSpringStyleEnv();

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectModule: pg,
  logging: false,
  pool: {
    max: 1,
    min: 0,
    idle: 10000
  },
  dialectOptions: {
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
