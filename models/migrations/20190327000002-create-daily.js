"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Daily", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      meterDate: {
        type: Sequelize.DATEONLY
      },
      startRead: {
        type: Sequelize.DECIMAL(12, 4)
      },
      endRead: {
        type: Sequelize.DECIMAL(12, 4)
      },
      consumption: {
        type: Sequelize.DECIMAL(12, 4)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Daily");
  }
};
