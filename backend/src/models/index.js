const sequelize = require('../config/database');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const HomeImage = require('./HomeImage');
const User = require('./User');

Order.hasMany(OrderItem, {
  as: 'itens',
  foreignKey: {
    name: 'pedidoId',
    field: 'pedido_id',
    allowNull: false
  },
  onDelete: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: {
    name: 'pedidoId',
    field: 'pedido_id'
  }
});

module.exports = {
  sequelize,
  Product,
  Order,
  OrderItem,
  HomeImage,
  User
};
