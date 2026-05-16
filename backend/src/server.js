const app = require('./app');
const { sequelize } = require('./models');
const { ensureAdmin, seedDefaultProducts } = require('./bootstrap');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

async function start() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
  await ensureAdmin();
  await seedDefaultProducts();

  app.listen(PORT, () => {
    console.log(`API Node rodando em http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error('Falha ao iniciar API Node:', error);
  process.exit(1);
});
