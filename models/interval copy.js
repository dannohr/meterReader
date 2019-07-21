"use strict";
module.exports = (sequelize, DataTypes) => {
  const Interval = sequelize.define(
    "Interval",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      meterDate: DataTypes.DATEONLY,
      start: DataTypes.STRING,
      end: DataTypes.STRING,
      startDateTime: DataTypes.DATE,
      consumption: DataTypes.DECIMAL(8, 4)
    },
    {}
  );

  return Interval;
};
