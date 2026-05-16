const express = require('express');
const { sequelize, Order, OrderItem } = require('../models');

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: OrderItem, as: 'itens' }],
      order: [['dataHora', 'DESC']]
    });

    return res.json(orders);
  } catch (error) {
    return next(error);
  }
});

router.post('/', async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const itens = Array.isArray(req.body.itens) ? req.body.itens : [];
    const order = await Order.create({
      nomeCliente: req.body.nomeCliente,
      telefoneCliente: req.body.telefoneCliente,
      enderecoCliente: req.body.enderecoCliente,
      comentarioCliente: req.body.comentarioCliente || '',
      total: Number(req.body.total || 0),
      status: normalizeStatus(req.body.status || 'CONFIRMED'),
      dataHora: req.body.dataHora || new Date()
    }, { transaction });

    await OrderItem.bulkCreate(itens.map((item) => ({
      pedidoId: order.id,
      nomeProduto: item.nomeProduto,
      preco: Number(item.preco || 0),
      quantidade: Number(item.quantidade || 1),
      subTotal: Number(item.subTotal || item.preco || 0)
    })), { transaction });

    await transaction.commit();

    const created = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'itens' }]
    });

    return res.status(201).json(created);
  } catch (error) {
    await transaction.rollback();
    return next(error);
  }
});

router.patch('/:id', updateOrder);
router.put('/:id', updateOrder);

async function updateOrder(req, res, next) {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'itens' }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido nao encontrado.' });
    }

    const fields = {};

    ['nomeCliente', 'telefoneCliente', 'enderecoCliente', 'comentarioCliente', 'status'].forEach((field) => {
      if (req.body[field] !== undefined) {
        fields[field] = req.body[field];
      }
    });

    if (req.body.total !== undefined) {
      fields.total = Number(req.body.total);
    }

    if (fields.status) {
      fields.status = normalizeStatus(fields.status);
    }

    await order.update(fields);
    return res.json(await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'itens' }]
    }));
  } catch (error) {
    return next(error);
  }
}

module.exports = router;

function normalizeStatus(status) {
  const value = String(status || '').trim().toUpperCase();

  if (value === 'COMPLETED' || value === 'CONCLUIDO' || value === 'CONCLUÍDO') {
    return 'COMPLETED';
  }

  if (value === 'CANCELED' || value === 'CANCELLED' || value === 'CANCELADO') {
    return 'CANCELLED';
  }

  if (value === 'CONFIRMED' || value === 'CONFIRMADO') {
    return 'CONFIRMED';
  }

  return value;
}
