const bcrypt = require('bcrypt');
const {
  allowCors,
  ensureReady,
  getPool,
  sendError
} = require('../backend/src/api/_produtos-db');

module.exports = async (req, res) => {

  if (allowCors(req, res)) {
    return;
  }

  if (req.method !== 'PUT') {
    res.setHeader('Allow', 'PUT,OPTIONS');

    return res.status(405).json({
      message: 'Método não permitido.'
    });
  }

  try {

    await ensureReady();

    const db = getPool();

    const {
      senhaAtual,
      novaSenha
    } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({
        message: 'Senha atual e nova senha são obrigatórias.'
      });
    }

    // Busca admin
    const { rows } = await db.query(
      'SELECT * FROM admin LIMIT 1'
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(404).json({
        message: 'Administrador não encontrado.'
      });
    }

    // Verifica senha atual
    const senhaValida = await bcrypt.compare(
      senhaAtual,
      admin.password
    );

    if (!senhaValida) {
      return res.status(401).json({
        message: 'Senha atual incorreta.'
      });
    }

    // Gera hash da nova senha
    const novaSenhaHash = await bcrypt.hash(
      novaSenha,
      10
    );

    // Atualiza senha
    await db.query(
      `
      UPDATE admin
      SET password = $1,
          updated_at = NOW()
      WHERE id = $2
      `,
      [novaSenhaHash, admin.id]
    );

    return res.status(200).json({
      success: true,
      message: 'Senha alterada com sucesso.'
    });

  } catch (error) {

    return sendError(res, error);

  }
};