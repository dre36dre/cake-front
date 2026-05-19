const { getPool } = require('./_produtos-db')

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { nomeCliente, telefoneCliente, enderecoCliente, comentarioCliente, total, itens } = req.body

    if (!nomeCliente || !telefoneCliente || !itens || itens.length === 0) {
      return res.status(400).json({ error: 'Dados incompletos' })
    }

    const pedidoQuery = `
      INSERT INTO pedidos (nome_cliente, telefone_cliente, endereco_cliente, comentario_cliente, total, data_hora)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `
    const pedidoValues = [nomeCliente, telefoneCliente, enderecoCliente, comentarioCliente || '', total]
    const pool = getPool()

    const pedidoResult = await pool.query(pedidoQuery, pedidoValues)
    const pedidoId = pedidoResult.rows[0].id

    const itemQuery = `
      INSERT INTO pedido_itens (pedido_id, nome_produto, preco, quantidade, subtotal)
      VALUES ($1, $2, $3, $4, $5)
    `

    for (const item of itens) {
      await pool.query(itemQuery, [
        pedidoId,
        item.nomeProduto,
        item.preco,
        item.quantidade,
        item.subTotal
      ])
    }

    return res.status(201).json({
      message: 'Pedido criado com sucesso',
      pedidoId
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
