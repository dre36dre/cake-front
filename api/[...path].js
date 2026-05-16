const defaultProducts = require('../backend/src/data/default-products');

let readyPromise;
let backendModules;

function loadBackendModules() {
  if (!backendModules) {
    backendModules = {
      app: require('../backend/src/app'),
      models: require('../backend/src/models'),
      bootstrap: require('../backend/src/bootstrap')
    };
  }

  return backendModules;
}

async function ensureReady() {
  const {
    models: { sequelize },
    bootstrap: { ensureAdmin, seedDefaultProducts }
  } = loadBackendModules();

  await sequelize.authenticate();
  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
  await ensureAdmin();
  await seedDefaultProducts();
}

module.exports = async (req, res) => {
  const originalUrl = req.url;
  const appUrl = originalUrl.replace(/^\/api/, '') || '/';

  if (appUrl === '/health') {
    try {
      await getReadyPromise();
      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      return res.status(503).json({
        status: 'degraded',
        message: 'API iniciada, mas o banco de dados nao respondeu.',
        error: error.message
      });
    }
  }

  let app;

  try {
    ({ app } = loadBackendModules());
  } catch (error) {
    console.error('Erro ao carregar backend:', error);

    if (req.method === 'GET' && appUrl === '/produtos') {
      return res.status(200).json(defaultProducts);
    }

    return res.status(500).json({
      message: 'Backend nao conseguiu iniciar no Vercel.',
      error: error.message
    });
  }

  if (!readyPromise) {
    readyPromise = ensureReady().catch((error) => {
      readyPromise = null;
      throw error;
    });
  }

  try {
    await readyPromise;
  } catch (error) {
    console.error('Erro ao inicializar API:', error);

    if (req.method === 'GET' && appUrl === '/produtos') {
      return res.status(200).json(defaultProducts);
    }

    return res.status(503).json({
      message: 'API indisponivel no momento. Verifique as variaveis de ambiente do banco de dados.',
      error: error.message
    });
  }

  req.url = appUrl;
  return app(req, res);
};

function getReadyPromise() {
  if (!readyPromise) {
    readyPromise = ensureReady().catch((error) => {
      readyPromise = null;
      throw error;
    });
  }

  return readyPromise;
}
