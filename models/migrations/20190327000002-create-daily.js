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
      name: {
        type: Sequelize.STRING
      },
      meterDate: {
        type: Sequelize.DATE
      },
      startRead: {
        type: Sequelize.DECIMAL(8, 4)
      },
      endRead: {
        type: Sequelize.DECIMAL(8, 4)
      },
      consumption: {
        type: Sequelize.DECIMAL(8, 4)
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Daily");
  }
};
