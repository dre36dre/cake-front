const bcrypt = require('bcryptjs');
const {
  allowAuthCors,
  ensureAdminTable,
  getBearerUser,
  getPool
} = require('../_admin-auth');

module.exports = async function handler(req, res) {
  if (allowAuthCors(req, res, ['POST'])) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo nao permitido.' });
  }

  try {
    const tokenUser = getBearerUser(req);

    if (!tokenUser?.sub) {
      return res.status(401).json({ message: 'Token ausente ou invalido.' });
    }

    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Senha atual e nova senha sao obrigatorias.' });
    }

    const db = getPool();
    await ensureAdminTable(db);

    const { rows } = await db.query(
      'SELECT * FROM usuarios WHERE username = $1 LIMIT 1',
      [tokenUser.sub]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    await db.query(
      'UPDATE usuarios SET password = $1 WHERE id = $2',
      [await bcrypt.hash(newPassword, 10), user.id]
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

