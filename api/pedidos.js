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

    // Criar tabela se não existir
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

    // CRIAR PEDIDO
    if (req.method === 'POST') {

      const {
        cliente,
        telefone,
        itens,
        total
      } = req.body;

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
        cliente || '',
        telefone || '',
        JSON.stringify(itens || []),
        total || 0
      ]);

      console.log('Pedido salvo:', rows[0]);

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