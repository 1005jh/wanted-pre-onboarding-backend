require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    host: process.env.DB_END_POINT,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: "1234",
    database: "test",
    port: "3306",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    port: +process.env.PROD_DB_PORT,
    host: process.env.PROD_DB_END_POINT,
    dialect: "mysql",
  },
};
