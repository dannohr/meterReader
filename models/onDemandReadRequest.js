"use strict";
module.exports = (sequelize, DataTypes) => {
  const OnDemandReadRequest = sequelize.define(
    "OnDemandReadRequest",
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },

      trans_id: DataTypes.STRING,
      correlationId: DataTypes.STRING,
      statusCode: DataTypes.STRING,
      statusReason: DataTypes.STRING,
      registeredRead: DataTypes.FLOAT,
      readDate: DataTypes.DATE,
    },
    {}
  );

  return OnDemandReadRequest;
};
