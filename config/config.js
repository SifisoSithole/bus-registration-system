require("dotenv").config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "bus_registration_system_database_development",
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "bus_registration_system_database_production",
    host: process.env.POSTGRES_HOST,
    dialect: "postgres",
  },
};
