"use strict";
module.exports = (sequelize, DataTypes) => {
  const OnDemand = sequelize.define(
    "OnDemand",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },

      readTime: DataTypes.DATE,
      previousDate: DataTypes.DATEONLY,
      currentMeterRead: DataTypes.DECIMAL(12, 4),
      previousMeterRead: DataTypes.DECIMAL(12, 4),
      consumption: DataTypes.DECIMAL(8, 4)
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

  return OnDemand;
};
