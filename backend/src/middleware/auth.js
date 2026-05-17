const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Token ausente.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'MINHA_CHAVE_SECRETA_SUPER_FORTE_QUE_TEM_PELO_MENOS_32_BYTES');
    return next();
  } catch {
    return res.status(401).json({ message: 'Token invalido.' });
  }
}

module.exports = authRequired;
