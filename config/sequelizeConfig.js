module.exports = {
  development: {
    username: "apps",
    password: "Password1",
    database: "meterReader",
    host: "192.168.1.101",
    dialect: "postgres",
    seederStorage: "sequelize",
    logging: false,
    define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true
    }
    // logging: console.log
  }
};
