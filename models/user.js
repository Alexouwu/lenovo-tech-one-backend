'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Guest), {
        foreignKey: 'guestId',
        onDelete: 'CASCADE'
      }
    }
  }
  User.init({
    name: DataTypes.TEXT,
    middlename: DataTypes.TEXT,
    business: DataTypes.TEXT,
    email: DataTypes.TEXT,
    password: DataTypes.TEXT,
    reset: DataTypes.TEXT,
    assistance: DataTypes.INTEGER,
    guestId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};