const express = require('express');
const { HomeImage } = require('../models');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const images = await HomeImage.findAll({ order: [['ordem', 'ASC'], ['id', 'ASC']] });
    return res.json(images.map((image) => ({
      id: image.id,
      url: image.url,
      arquivo: image.url,
      titulo: image.url,
      ordem: image.ordem
    })));
  } catch (error) {
    return next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const images = Array.isArray(req.body) ? req.body : [];
    await HomeImage.destroy({ where: {} });
    await HomeImage.bulkCreate(images.map((image, index) => ({
      url: image.url || image.arquivo,
      ordem: image.ordem || index + 1
    })));
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
