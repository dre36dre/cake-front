const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HomeImage = sequelize.define('HomeImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'imagem_home',
  timestamps: false
});

module.exports = HomeImage;
