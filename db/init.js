import sequelize from "./sequelize.js";
import User from "./users.js";
import Contact from "./contacts.js";

await sequelize.sync({ alter: true });
