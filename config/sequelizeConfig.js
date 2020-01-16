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
  },
  developmentSQL: {
    username: "sa",
    password: "Password1",
    database: "meterReader",
    host: "192.168.1.101",
    dialect: "mssql",
    dialectOptions: {
      encrypt: true,
      options: {
        requestTimeout: 60000,
        port: 1433
      }
    },
    define: {
      freezeTableName: true
    },
    seederStorage: "sequelize",
    logging: false
    // logging: console.log
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:"
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: "mysql",
    use_env_variable: "DATABASE_URL"
  }
};
