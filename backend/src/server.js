// server.js
require('dotenv').config();

const app = require('./src/app');
const { sequelize } = require('./src/models');
const { ensureAdmin, seedDefaultProducts } = require('./src/bootstrap');

const PORT = process.env.PORT || 8080;

/**
 * Inicializa banco e dados padrão.
 * Na Vercel, não usamos app.listen().
 * Em desenvolvimento local, o servidor sobe normalmente.
 */
async function initialize() {
  await sequelize.authenticate();
  console.log('Banco conectado com sucesso.');

  await sequelize.sync({
    alter: process.env.DB_SYNC_ALTER === 'true'
  });

  await ensureAdmin();
  await seedDefaultProducts();
}

// Executa a inicialização uma única vez
const ready = initialize().catch((error) => {
  console.error('Falha ao iniciar API Node:', error);
  throw error;
});

// Somente em desenvolvimento local inicia o servidor HTTP
if (process.env.VERCEL !== '1') {
  ready
    .then(() => {
      app.listen(PORT, () => {
        console.log(`API Node rodando em http://localhost:${PORT}`);
      });
    })
    .catch(() => {
      process.exit(1);
    });
}

// Exporta um handler compatível com a Vercel
module.exports = async (req, res) => {
  await ready;
  return app(req, res);
};