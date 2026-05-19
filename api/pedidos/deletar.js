const { ensureOrderTables, getPool } = require('../_pedidos-db')

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { id } = req.query
    const pool = getPool()
    await ensureOrderTables(pool)

    if (!id) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório' })
    }

    await pool.query(`DELETE FROM pedido_itens WHERE pedido_id = $1`, [id])
    const result = await pool.query(`DELETE FROM pedidos WHERE id = $1 RETURNING *`, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    return res.status(200).json({ message: 'Pedido removido com sucesso' })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
