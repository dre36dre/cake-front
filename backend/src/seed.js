ADirequire('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { sequelize } = require('./models');
const { ensureAdmin, seedDefaultProducts } = require('./bootstrap');

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
  await ensureAdmin();
  await seedDefaultProducts();

  console.log('Produtos padrao cadastrados/atualizados com sucesso.');
}

seed()
  .catch((error) => {
    console.error('Erro ao executar seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
