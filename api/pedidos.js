const {
  allowCors,
  ensureReady,
  getPool,
  sendError
} = require('./_produtos-db');

module.exports = async (req, res) => {

  console.log('METHOD:', req.method);
  console.log('BODY:', req.body);

  if (allowCors(req, res)) {
    return;
  }

  try {

    await ensureReady();

    const db = getPool();

    // CRIAR TABELA SE NÃO EXISTIR
    await db.query(`
      CREATE TABLE IF NOT EXISTS pedido (
        id SERIAL PRIMARY KEY,
        nome_cliente TEXT,
        telefone_cliente TEXT,
        endereco_cliente TEXT,
        comentario_cliente TEXT,
        itens JSONB,
        total NUMERIC(10,2),
        status TEXT DEFAULT 'CONFIRMED',
        data_hora TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // GARANTIR COLUNAS
    await db.query(`
      ALTER TABLE pedido
      ADD COLUMN IF NOT EXISTS nome_cliente TEXT
    `);

    await db.query(`
      ALTER TABLE pedido
      ADD COLUMN IF NOT EXISTS telefone_cliente TEXT
    `);

    await db.query(`
      ALTER TABLE pedido
      ADD COLUMN IF NOT EXISTS endereco_cliente TEXT
    `);

    await db.query(`
      ALTER TABLE pedido
      ADD COLUMN IF NOT EXISTS comentario_cliente TEXT
    `);

    await db.query(`
      ALTER TABLE pedido
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'CONFIRMED'
    `);

    await db.query(`
      ALTER TABLE pedido
      ADD COLUMN IF NOT EXISTS data_hora TIMESTAMP NOT NULL DEFAULT NOW()
    `);

    // LISTAR PEDIDOS
    if (req.method === 'GET') {

      const { rows } = await db.query(`
        SELECT *
        FROM pedido
        ORDER BY data_hora DESC
      `);

      return res.status(200).json(rows);
    }

    // SALVAR PEDIDO
    if (req.method === 'POST') {

      const cliente =
        req.body.nomeCliente || '';

      const telefone =
        req.body.telefoneCliente || '';

      const endereco =
        req.body.enderecoCliente || '';

      const comentario =
        req.body.comentarioCliente || '';

      const itens =
        req.body.itens || [];

      const total =
        req.body.total || 0;

      const { rows } = await db.query(`
        INSERT INTO pedido (
          nome_cliente,
          telefone_cliente,
          endereco_cliente,
          comentario_cliente,
          itens,
          total,
          status,
          data_hora
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
        RETURNING *
      `,
      [
        cliente,
        telefone,
        endereco,
        comentario,
        JSON.stringify(itens),
        total,
        'CONFIRMED'
      ]);

      return res.status(201).json({
        success: true,
        pedido: rows[0]
      });
    }

    res.setHeader('Allow', 'GET,POST,OPTIONS');

    return res.status(405).json({
      message: 'Método não permitido.'
    });

  } catch (error) {

    console.error('ERRO API PEDIDOS:', error);

    return sendError(res, error);

  }
};