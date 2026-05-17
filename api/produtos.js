const {
  allowCors,
  ensureReady,
  getPool,
  mapProduct,
  normalizeProduct,
  sendError,
  validateProduct
} = require('./_produtos-db');

module.exports = async (req, res) => {
  if (allowCors(req, res)) {
    return;
  }

  try {
    await ensureReady();
    const db = getPool();

    if (req.method === 'GET') {
      const { rows } = await db.query('SELECT * FROM produto ORDER BY id ASC');
      return res.status(200).json(rows.map(mapProduct));
    }

    if (req.method === 'POST') {
      const product = normalizeProduct(req.body);
      validateProduct(product);

      const { rows } = await db.query(
        `INSERT INTO produto (name, description, price, available, image_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [product.name, product.description, product.price, product.available, product.imageUrl]
      );

      return res.status(201).json(mapProduct(rows[0]));
    }

    res.setHeader('Allow', 'GET,POST,OPTIONS');
    return res.status(405).json({ message: 'Metodo nao permitido.' });
  } catch (error) {
    return sendError(res, error);
  }
};
