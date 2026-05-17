const app = require('../backend/src/app');
const { sequelize } = require('../backend/src/models');
const { ensureAdmin, seedDefaultProducts } = require('../backend/src/bootstrap');

let readyPromise;

async function ensureReady() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await sequelize.authenticate();
      await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
      await ensureAdmin();
      await seedDefaultProducts();
    })();
  }

  return readyPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureReady();

    req.url = req.url.replace(/^\/api/, '') || '/';
    return app(req, res);
  } catch (error) {
    console.error('Falha ao iniciar API dentro do confeitaria-app:', error);
    return res.status(500).json({
      message: error.message || 'Erro ao iniciar API.'
    });
  }
};
