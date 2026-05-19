const { ensureOrderTables, getPool, mapPedido } = require('./_pedidos-db')

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      const pool = getPool()
      await ensureOrderTables(pool)

      const pedidosResult = await pool.query(`
        SELECT *
        FROM pedidos
        ORDER BY data_hora DESC
      `)

      const itensResult = await pool.query(`
        SELECT *
        FROM pedido_itens
      `)

      const pedidos = pedidosResult.rows.map((pedido) =>
        mapPedido(
          pedido,
          itensResult.rows.filter((item) => item.pedido_id === pedido.id)
        )
      )

      return res.status(200).json(pedidos)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { nomeCliente, telefoneCliente, enderecoCliente, comentarioCliente, total, itens } = req.body
    const pool = getPool()
    await ensureOrderTables(pool)
    const client = await pool.connect()

    try {
      if (!nomeCliente || !telefoneCliente || !itens || itens.length === 0) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }

      const pedidoQuery = `
        INSERT INTO pedidos (nome_cliente, telefone_cliente, endereco_cliente, comentario_cliente, total, status, data_hora)
        VALUES ($1, $2, $3, $4, $5, 'CONFIRMED', NOW())
        RETURNING id
      `
      const pedidoValues = [nomeCliente, telefoneCliente, enderecoCliente, comentarioCliente || '', total]

      await client.query('BEGIN')
      const pedidoResult = await client.query(pedidoQuery, pedidoValues)
      const pedidoId = pedidoResult.rows[0].id

      const itemQuery = `
        INSERT INTO pedido_itens (pedido_id, nome_produto, preco, quantidade, subtotal)
        VALUES ($1, $2, $3, $4, $5)
      `

      for (const item of itens) {
        await client.query(itemQuery, [
          pedidoId,
          item.nomeProduto,
          item.preco,
          item.quantidade,
          item.subTotal
        ])
      }

      await client.query('COMMIT')

      return res.status(201).json({
        message: 'Pedido criado com sucesso',
        pedidoId
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
