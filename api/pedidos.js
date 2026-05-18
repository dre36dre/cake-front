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
    endereco TEXT,
    comentario TEXT,
    itens JSONB,
    total NUMERIC(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
  )
`);

await db.query(`
  ALTER TABLE pedido
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW()
`);

await db.query(`
  ALTER TABLE pedido
  ADD COLUMN IF NOT EXISTS endereco TEXT
`);

await db.query(`
  ALTER TABLE pedido
  ADD COLUMN IF NOT EXISTS comentario TEXT
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
  req.body.cliente ||
  req.body.nome ||
  req.body.nomeCliente ||
  '';

const telefone =
  req.body.telefone ||
  req.body.whatsapp ||
  req.body.telefoneCliente ||
  '';

const endereco =
  req.body.endereco ||
  req.body.enderecoCliente ||
  '';

const comentario =
  req.body.comentario ||
  req.body.comentarioCliente ||
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
  sucess: true,
  pedido: rows[0]
});
    }

    res.setHeader('Allow', 'GET,POST,OPTIONS');

    return res.status(405).json({
      message: 'Método não permitido.'
    });

  } catch (error) {

    return sendError(res, error);

  }
};