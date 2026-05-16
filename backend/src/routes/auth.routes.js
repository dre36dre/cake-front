const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const { User } = require('../models');
const authRequired = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const login = username || email;

    if (!login || !password) {
      return res.status(400).json({ message: 'Usuario e senha sao obrigatorios.' });
    }

    const user = await User.findOne({ where: { username: login } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais invalidas.' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || 'MINHA_CHAVE_SECRETA_SUPER_FORTE_QUE_TEM_PELO_MENOS_32_BYTES',
      {
        expiresIn: '1h',
        subject: user.username
      }
    );

    return res.json({ token, role: normalizeRole(user.role) });
  } catch (error) {
    return next(error);
  }
});

router.post('/change-password', authRequired, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Senha atual e nova senha sao obrigatorias.' });
    }

    const user = await User.findOne({ where: { username: req.user.sub } });

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Senha atual incorreta.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

function normalizeRole(role) {
  return String(role || '').toUpperCase() === 'ADMIN' ? 'admin' : String(role || '').toLowerCase();
}
