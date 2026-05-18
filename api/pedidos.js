const {
  allowCors,
  ensureReady,
  getPool,
  sendError
} = require('./_produtos-db');

module.exports = async (req, res) => {

  if (allowCors(req, res)) {
    return;
  }

  try {

    await ensureReady();

    const db = getPool();

    await db.query(`
      CREATE TABLE IF NOT EXISTS pedido (
        id SERIAL PRIMARY KEY,
        cliente TEXT,
        telefone TEXT,
        itens JSONB,
        total NUMERIC(10,2),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // LISTAR PEDIDOS
    if (req.method === 'GET') {

      const { rows } = await db.query(`
        SELECT *
        FROM pedido
        ORDER BY created_at DESC
      `);

      return res.status(200).json(rows);
    }

    // SALVAR PEDIDO
    if (req.method === 'POST') {

      const cliente =
        req.body.cliente ||
        req.body.nome ||
        '';

      const telefone =
        req.body.telefone ||
        req.body.whatsapp ||
        '';

      const itens =
        req.body.itens ||
        req.body.produtos ||
        [];

      const total =
        req.body.total ||
        req.body.valorTotal ||
        0;

      const { rows } = await db.query(`
        INSERT INTO pedido (
          cliente,
          telefone,
          itens,
          total
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `, [
        cliente,
        telefone,
        JSON.stringify(itens),
        total
      ]);

      return res.status(201).json(rows[0]);
    }

    res.setHeader('Allow', 'GET,POST,OPTIONS');

    return res.status(405).json({
      message: 'Método não permitido.'
    });

  } catch (error) {

    return sendError(res, error);

  }
};