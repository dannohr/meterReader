"use strict";
module.exports = (sequelize, DataTypes) => {
  const Daily = sequelize.define(
    "Daily",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
      },
      meterDate: DataTypes.DATEONLY,
      startRead: DataTypes.DECIMAL(12, 4),
      endRead: DataTypes.DECIMAL(12, 4),
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

  return Daily;
};
