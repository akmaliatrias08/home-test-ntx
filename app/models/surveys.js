const { DataTypes } = require('sequelize');
const db = require('./database');
const { now } = require('sequelize/types/utils.js');
const { DataTypes } = require('sequelize/types/index.js');

const Surveys = db.sequelize.define('Surveys', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    values: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'surveys',
    freezeTableName: true,
    timestamps: false,
  });
  
  module.exports = Surveys;