const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getPool } = require('./_produtos-db');

const JWT_SECRET = process.env.JWT_SECRET || 'MINHA_CHAVE_SECRETA_SUPER_FORTE_QUE_TEM_PELO_MENOS_32_BYTES';

async function ensureAdminTable(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'ADMIN'
    )
  `);
}

async function findOrCreateRecoveryAdmin(db, username, password) {
  const { rows } = await db.query(
    'SELECT * FROM usuarios WHERE username = $1 LIMIT 1',
    [username]
  );

  if (rows[0]) {
    return rows[0];
  }

  if (!isAdmin(username) || !isRecoveryPassword(password)) {
    return null;
  }

  const hash = await bcrypt.hash(password, 10);
  const created = await db.query(
    `INSERT INTO usuarios (username, password, role)
     VALUES ($1, $2, 'ADMIN')
     RETURNING *`,
    [process.env.ADMIN_USERNAME || 'admin', hash]
  );

  return created.rows[0];
}

function createToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role },
    JWT_SECRET,
    {
      expiresIn: '1h',
      subject: user.username
    }
  );
}

function isAdmin(login) {
  return String(login || '').trim().toLowerCase() === (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
}

function isRecoveryPassword(password) {
  return [
    process.env.ADMIN_PASSWORD || 'cake123',
    'cake123',
    'confeitaria123#',
    'confeitaria123'
  ].includes(password);
}

function normalizeRole(role) {
  return String(role || '').toUpperCase() === 'ADMIN' ? 'admin' : String(role || '').toLowerCase();
}

function getBearerUser(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return null;
  }

  return jwt.verify(token, JWT_SECRET);
}

function allowAuthCors(req, res, methods) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', `${methods.join(', ')}, OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}

module.exports = {
  allowAuthCors,
  createToken,
  ensureAdminTable,
  findOrCreateRecoveryAdmin,
  getBearerUser,
  getPool,
  isRecoveryPassword,
  normalizeRole
};

