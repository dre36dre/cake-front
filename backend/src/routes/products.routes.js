const express = require('express');
const { Product } = require('../models');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const products = await Product.findAll({ order: [['id', 'ASC']] });
    return res.json(products);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const payload = normalizeProduct(req.body);
    validateProduct(payload);
    const product = await Product.create(payload);
    return res.status(201).json(product);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto nao encontrado.' });
    }

    const payload = normalizeProduct(req.body);
    validateProduct(payload);
    await product.update(payload);
    return res.json(product);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Produto nao encontrado.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

function normalizeProduct(body) {
  return {
    name: String(body.name || '').trim(),
    description: body.description || '',
    price: Number(body.price || 0),
    available: body.available ?? true,
    imageUrl: normalizeImageUrl(body.imageUrl)
  };
}

function validateProduct(product) {
  if (!product.name) {
    throw Object.assign(new Error('Nome do produto e obrigatorio.'), { status: 400 });
  }

  if (product.price < 0) {
    throw Object.assign(new Error('Price cannot be negative'), { status: 400 });
  }
}

function normalizeImageUrl(imageUrl) {
  if (!imageUrl || !String(imageUrl).trim()) {
    return null;
  }

  const value = String(imageUrl).trim();

  if (value.startsWith('data:') || value.startsWith('http://') || value.startsWith('https://') || value.startsWith('assets/')) {
    return value;
  }

  const fileName = value.split(/[\\/]/).pop();
  return `/imagens/${fileName}`;
}

module.exports = router;
