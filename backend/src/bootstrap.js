const bcrypt = require('bcryptjs');
const { User, Product } = require('./models');
const defaultProducts = require('./data/default-products');

async function ensureAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'cake123';

  const [user, created] = await User.findOrCreate({
    where: { username },
    defaults: {
      password: await bcrypt.hash(password, 10),
      role: 'ADMIN'
    }
  });

  if (!created && process.env.RESET_ADMIN_PASSWORD === 'true') {
    user.password = await bcrypt.hash(password, 10);
    await user.save();
  }
}

async function seedDefaultProducts() {
  for (const product of defaultProducts) {
    const existing = await Product.findByPk(product.id);

    if (existing) {
      await existing.update(product);
      continue;
    }

    await Product.create(product);
  }
}

module.exports = {
  ensureAdmin,
  seedDefaultProducts
};
