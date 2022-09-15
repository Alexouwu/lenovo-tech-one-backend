'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Guest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Guest.hasOne(models.User, {
        foreignKey: 'guestId'
      })
    }
  }
  Guest.init({
    email: DataTypes.TEXT,
    fecha: DataTypes.TEXT,
    horario: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Guest',
  });
  return Guest;
};