const {
  allowCors,
  ensureReady,
  getPool,
  mapProduct,
  normalizeProduct,
  sendError,
  validateProduct
} = require('../_produtos-db');

module.exports = async (req, res) => {
  if (allowCors(req, res)) {
    return;
  }

  try {
    await ensureReady();
    const db = getPool();
    const id = Number(req.query.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: 'ID de produto invalido.' });
    }

    if (req.method === 'PUT') {
      const product = normalizeProduct(req.body);
      validateProduct(product);

      const { rows } = await db.query(
        `UPDATE produto
         SET name = $1,
             description = $2,
             price = $3,
             available = $4,
             image_url = $5,
             updated_at = NOW()
         WHERE id = $6
         RETURNING *`,
        [product.name, product.description, product.price, product.available, product.imageUrl, id]
      );

      if (!rows[0]) {
        return res.status(404).json({ message: 'Produto nao encontrado.' });
      }

      return res.status(200).json(mapProduct(rows[0]));
    }

    if (req.method === 'DELETE') {
      const { rowCount } = await db.query('DELETE FROM produto WHERE id = $1', [id]);

      if (rowCount === 0) {
        return res.status(404).json({ message: 'Produto nao encontrado.' });
      }

      return res.status(204).end();
    }

    res.setHeader('Allow', 'PUT,DELETE,OPTIONS');
    return res.status(405).json({ message: 'Metodo nao permitido.' });
  } catch (error) {
    return sendError(res, error);
  }
};
