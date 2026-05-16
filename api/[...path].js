const app = require('../backend/src/app');
const { sequelize } = require('../backend/src/models');
const { ensureAdmin, seedDefaultProducts } = require('../backend/src/bootstrap');

let readyPromise;

async function ensureReady() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
  await ensureAdmin();
  await seedDefaultProducts();
}

module.exports = async (req, res) => {
  if (!readyPromise) {
    readyPromise = ensureReady();
  }

  await readyPromise;

  req.url = req.url.replace(/^\/api/, '') || '/';
  return app(req, res);
};
