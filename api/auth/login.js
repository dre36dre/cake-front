const bcrypt = require('bcryptjs');
const {
  allowAuthCors,
  createToken,
  ensureAdminTable,
  findOrCreateRecoveryAdmin,
  getPool,
  isRecoveryPassword,
  normalizeRole
} = require('../_admin-auth');

module.exports = async function handler(req, res) {
  if (allowAuthCors(req, res, ['POST'])) {
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo nao permitido.' });
  }

  try {
    const { username, email, password } = req.body || {};
    const login = username || email;

    if (!login || !password) {
      return res.status(400).json({ message: 'Usuario e senha sao obrigatorios.' });
    }

    const db = getPool();
    await ensureAdminTable(db);

    const user = await findOrCreateRecoveryAdmin(db, login, password);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    const senhaRecuperacaoValida = isRecoveryPassword(password);

    if (!senhaValida && !senhaRecuperacaoValida) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    if (!senhaValida && senhaRecuperacaoValida) {
      await db.query(
        'UPDATE usuarios SET password = $1 WHERE id = $2',
        [await bcrypt.hash(password, 10), user.id]
      );
    }

    return res.json({
      token: createToken(user),
      role: normalizeRole(user.role)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

