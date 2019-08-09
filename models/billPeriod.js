"use strict";
module.exports = (sequelize, DataTypes) => {
  const BillPeriod = sequelize.define(
    "BillPeriod",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },

      start: DataTypes.DATEONLY,
      end: DataTypes.DATEONLY
    },
    {}
  );

  // Daily.associate = models => {
  //   // Company.hasMany(models.UserCompany, {});
  //   Daily.belongsToMany(models.User, {
  //     through: models.UserCompany
  //   });
  //   Daily.belongsTo(models.Address, {});
  // };

  return BillPeriod;
};
