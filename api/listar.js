const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const pedidosQuery = `
      SELECT *
      FROM pedidos
      ORDER BY data_hora DESC
    `
    const pedidosResult = await pool.query(pedidosQuery)
    const pedidos = pedidosResult.rows

    const itensQuery = `
      SELECT *
      FROM pedido_itens
    `
    const itensResult = await pool.query(itensQuery)
    const itens = itensResult.rows

    const pedidosComItens = pedidos.map(p => ({
      ...p,
      itens: itens.filter(i => i.pedido_id === p.id)
    }))

    return res.status(200).json(pedidosComItens)

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
