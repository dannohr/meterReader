"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("OnDemand", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      readTime: {
        type: Sequelize.DATE
      },

      previousDate: {
        type: Sequelize.DATE
      },
      currentMeterRead: {
        type: Sequelize.DECIMAL(12, 4)
      },
      previousMeterRead: {
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
    return queryInterface.dropTable("OnDemand");
  }
};
