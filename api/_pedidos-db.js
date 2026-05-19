const { getPool } = require('./_produtos-db');

async function ensureOrderTables(db) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      nome_cliente VARCHAR(255) NOT NULL,
      telefone_cliente VARCHAR(50) NOT NULL,
      endereco_cliente TEXT,
      comentario_cliente TEXT,
      total NUMERIC(10, 2) NOT NULL DEFAULT 0,
      status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
      data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS pedido_itens (
      id SERIAL PRIMARY KEY,
      pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
      nome_produto VARCHAR(255) NOT NULL,
      preco NUMERIC(10, 2) NOT NULL DEFAULT 0,
      quantidade INTEGER NOT NULL DEFAULT 1,
      subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0
    )
  `);

  await db.query(`
    ALTER TABLE pedidos
    ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED'
  `);
}

function mapPedido(row, itens = []) {
  return {
    id: row.id,
    nomeCliente: row.nome_cliente,
    telefoneCliente: row.telefone_cliente,
    enderecoCliente: row.endereco_cliente,
    comentarioCliente: row.comentario_cliente,
    total: Number(row.total),
    status: row.status || 'CONFIRMED',
    dataHora: row.data_hora,
    itens: itens.map(mapItem)
  };
}

function mapItem(row) {
  return {
    id: row.id,
    pedidoId: row.pedido_id,
    nomeProduto: row.nome_produto,
    preco: Number(row.preco),
    quantidade: Number(row.quantidade),
    subTotal: Number(row.subtotal)
  };
}

module.exports = {
  ensureOrderTables,
  getPool,
  mapPedido
};

