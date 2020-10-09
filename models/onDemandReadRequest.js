("use strict");
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
      createdAt: {
        type: DataTypes.DATE,
        //note here this is the guy that you are looking for
        // get() {
        //   return moment(this.getDataValue("createdAt")).format(
        //     "DD/MM/YYYY h:mm:ss"
        //   );
        // },
      },
      updatedAt: {
        type: DataTypes.DATE,
        // get() {
        //   return moment(this.getDataValue("updatedAt")).format(
        //     "DD/MM/YYYY h:mm:ss"
        //   );
        // },
      },
    },
    {}
  );

  return OnDemandReadRequest;
};
