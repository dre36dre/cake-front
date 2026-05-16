const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes = require('./routes/orders.routes');
const imagesRoutes = require('./routes/images.routes');
const homeImagesRoutes = require('./routes/home-images.routes');

const uploadsDir = process.env.UPLOADS_DIR ||
  (process.env.VERCEL ? path.join('/tmp', 'uploads') : path.resolve(__dirname, '../uploads'));
fs.mkdirSync(uploadsDir, { recursive: true });

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true
}));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/imagens', express.static(uploadsDir));
app.use('/auth', authRoutes);
app.use('/produtos', productsRoutes);
app.use('/pedidos', ordersRoutes);
app.use('/imagens', imagesRoutes);
app.use('/imagens-home', homeImagesRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor.'
  });
});

module.exports = app;
