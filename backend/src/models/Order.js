const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nomeCliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefoneCliente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  enderecoCliente: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  comentarioCliente: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0,
    get() {
      const value = this.getDataValue('total');
      return value === null ? value : Number(value);
    }
  },
  status: {
    type: DataTypes.ENUM('CONFIRMED', 'COMPLETED', 'CANCELLED'),
    allowNull: false,
    defaultValue: 'CONFIRMED'
  },
  dataHora: {
    type: DataTypes.DATE,
    field: 'data_hora',
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pedido',
  timestamps: false
});

module.exports = Order;
