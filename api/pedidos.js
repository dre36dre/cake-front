export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const pedido = req.body;

      console.log('Pedido recebido:', pedido);

      return res.status(201).json({
        sucesso: true
      });

    } catch (err) {
      return res.status(500).json({
        erro: err.message
      });
    }
  }

  return res.status(405).json({
    erro: 'Método não permitido'
  });
}