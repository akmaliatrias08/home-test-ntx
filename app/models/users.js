const { DataTypes } = require('sequelize');
const db = require('./database');
const Surveys = require('./surveys');

const Users = db.sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  digits: {
    type: DataTypes.STRING(155),
    unique: true,
    allowNull: true,
  },
  fotoUrl: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  workType: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  positionTitle: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  lon: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  company: {
    type: DataTypes.STRING(155),
    allowNull: true,
  },
  isLogin: {
    type: DataTypes.BOOLEAN,
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
  },
  dovote: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  dosurvey: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  dofeedback: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  },
  fullname: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  cuurentLeave: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'users',
  freezeTableName: true,
  timestamps: false,
});

module.exports = Users