'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      middlename: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      business: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,      
        unique: true  
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false        
      },
      reset: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      assistance: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      guestId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Guests',
          key: 'id',
          as: 'guestId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};