const { getPool } = require('../_produtos-db')

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'PATCH' && req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { id } = req.query
    const { nomeCliente, telefoneCliente, enderecoCliente, comentarioCliente, status, total } = req.body
    const pool = getPool()

    if (!id) {
      return res.status(400).json({ error: 'ID do pedido é obrigatório' })
    }

    const fields = []
    const values = []
    let index = 1

    if (nomeCliente) { fields.push(`nome_cliente = $${index++}`); values.push(nomeCliente) }
    if (telefoneCliente) { fields.push(`telefone_cliente = $${index++}`); values.push(telefoneCliente) }
    if (enderecoCliente) { fields.push(`endereco_cliente = $${index++}`); values.push(enderecoCliente) }
    if (comentarioCliente) { fields.push(`comentario_cliente = $${index++}`); values.push(comentarioCliente) }
    if (status) { fields.push(`status = $${index++}`); values.push(status) }
    if (total !== undefined) { fields.push(`total = $${index++}`); values.push(total) }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo enviado para atualização' })
    }

    values.push(id)

    const query = `
      UPDATE pedidos
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING *
    `

    const result = await pool.query(query, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado' })
    }

    return res.status(200).json(result.rows[0])

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
