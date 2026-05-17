const { Pool } = require('pg');

const defaultProducts = [
  ['100 Brigadeiros recheados', 'Ninho com Nutella - Ninho com uva - Pacoca - Churros', 140, true, 'assets/imagens/brigadeiros-recheados.jpg'],
  ['100 Brigadeiros', 'Tradicional - Beijinho - Cafe - Ninho', 100, true, 'assets/imagens/brigadeiros-tradicional.jpg'],
  ['Mousse', 'Limao - Maracuja - Morango', 80, true, 'assets/imagens/mousse.jpg'],
  ['Bolo', 'Bolo artesanal decorado', 120, true, 'assets/imagens/bolo.JPG'],
  ['Bolo de pote', 'Bolo de pote artesanal', 12, true, 'assets/imagens/bolo-pote.JPG'],
  ['Copo surpresa', 'Copo surpresa com camadas doces', 15, true, 'assets/imagens/copo-surpresa.JPG'],
  ['Mini pudim', 'Mini pudim individual', 8, true, 'assets/imagens/mini-pudim.JPG'],
  ['Pudim para compartilhar', 'Pudim tamanho familia', 45, true, 'assets/imagens/pudim-compartilhar.JPG'],
  ['Pudim familia', 'Pudim artesanal', 55, true, 'assets/imagens/pudim.JPG'],
  ['Pudim 2', 'Pudim artesanal com calda', 55, true, 'assets/imagens/pudim-2.JPG'],
  ['Trufas', 'Trufas artesanais', 5, true, 'assets/imagens/trufas.JPG'],
  ['Beijinho', 'Beijinho tradicional', 3, true, 'assets/imagens/beijinho.JPG']
];

let pool;
let readyPromise;

function getPool() {
  const databaseUrl = process.env.DATABASE_PUBLIC_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL;

  if (!databaseUrl) {
    throw new Error('Configure DATABASE_URL ou DATABASE_PUBLIC_URL nas variaveis da Vercel.');
  }

  if (!pool) {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DB_SSL === 'false'
        ? undefined
        : { rejectUnauthorized: false }
    });
  }

  return pool;
}

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      const db = getPool();

      await db.query(`
        CREATE TABLE IF NOT EXISTS produto (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          price NUMERIC(10, 2) NOT NULL DEFAULT 0,
          available BOOLEAN NOT NULL DEFAULT TRUE,
          image_url TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      await db.query('ALTER TABLE produto ALTER COLUMN image_url TYPE TEXT');

      const { rows } = await db.query('SELECT COUNT(*)::int AS total FROM produto');
      if (rows[0].total === 0) {
        for (const product of defaultProducts) {
          await db.query(
            `INSERT INTO produto (name, description, price, available, image_url)
             VALUES ($1, $2, $3, $4, $5)`,
            product
          );
        }
      }
    })();
  }

  return readyPromise;
}

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    available: row.available,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function normalizeProduct(body) {
  return {
    name: String(body?.name || '').trim(),
    description: String(body?.description || ''),
    price: Number(body?.price || 0),
    available: body?.available ?? true,
    imageUrl: normalizeImageUrl(body?.imageUrl)
  };
}

function validateProduct(product) {
  if (!product.name) {
    throw Object.assign(new Error('Nome do produto e obrigatorio.'), { status: 400 });
  }

  if (!Number.isFinite(product.price) || product.price < 0) {
    throw Object.assign(new Error('Preco invalido.'), { status: 400 });
  }
}

function normalizeImageUrl(imageUrl) {
  const value = String(imageUrl || '').trim();

  if (!value) {
    return null;
  }

  if (
    value.startsWith('data:') ||
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('assets/') ||
    value.startsWith('/')
  ) {
    return value;
  }

  const fileName = value.split(/[\\/]/).pop();
  return fileName ? `assets/imagens/${fileName}` : null;
}

function sendError(res, error) {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || 'Erro interno do servidor.'
  });
}

function allowCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }

  return false;
}

module.exports = {
  allowCors,
  ensureReady,
  getPool,
  mapProduct,
  normalizeProduct,
  sendError,
  validateProduct
};
