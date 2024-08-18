const { DataTypes } = require('sequelize');
const db = require('./database');

const Attacks = db.sequelize.define('Attacks', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  sourceCountry: {
    type: DataTypes.STRING(155),
    unique: true,
    allowNull: true,
  },
  destinationCountry: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'attacks',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Attacks