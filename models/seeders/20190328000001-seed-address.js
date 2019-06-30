"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    // Add altering commands here.
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkInsert(
      "Address",
      [
        {
          name: "TestCo Inc.",
          address: "123 Main St.",
          city: "Dallas",
          state: "TX",
          zip: "75201",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Customer 1 Shipping",
          address: "456 Home St.",
          city: "Irving",
          state: "TX",
          zip: "75211",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Customer 1 Billing",
          address: "456 Home St.",
          city: "Irving",
          state: "TX",
          zip: "75211",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Vendor 1 ",
          address: "999 Apply St.",
          city: "Coppell",
          state: "TX",
          zip: "75123",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    // Return a promise to correctly handle asynchronicity.

    return queryInterface.bulkDelete("Address", null, {});
  }
};
