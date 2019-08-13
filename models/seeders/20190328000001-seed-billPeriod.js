"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkInsert(
      "BillPeriod",
      [
        {
          start: "2019/04/06",
          end: "2019/05/07",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/05/08",
          end: "2019/06/06",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/06/07",
          end: "2019/07/08",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/07/09",
          end: "2019/08/06",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/08/07",
          end: "2019/09/06",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/09/07",
          end: "2019/10/07",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/10/08",
          end: "2019/11/06",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          start: "2019/11/07",
          end: "2019/12/07",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkDelete("BillPeriod", null, {});
  }
};
