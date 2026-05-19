const { getPool } = require('../_produtos-db')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { id } = req.query
    const pool = getPool()

    if (!id) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório' })
    }

    const pedidoResult = await pool.query(`SELECT * FROM pedidos WHERE id = $1`, [id])

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    const itensResult = await pool.query(`SELECT * FROM pedido_itens WHERE pedido_id = $1`, [id])

    return res.status(200).json({
      ...pedidoResult.rows[0],
      itens: itensResult.rows
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
