const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nomeProduto: {
    type: DataTypes.STRING,
    allowNull: false
  },
  preco: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    get() {
      const value = this.getDataValue('preco');
      return value === null ? value : Number(value);
    }
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  subTotal: {
    type: DataTypes.DOUBLE,
    field: 'sub_total',
    allowNull: false,
    defaultValue: 0,
    get() {
      const value = this.getDataValue('subTotal');
      return value === null ? value : Number(value);
    }
  }
}, {
  tableName: 'item_pedido',
  timestamps: false
});

module.exports = OrderItem;
