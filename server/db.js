// config/db.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.PG_URL, {
  dialect: "postgres",
  logging: false, // Mettre true pour voir les requêtes SQL dans la console
});

try {
  await sequelize.authenticate();
  console.log("Connected to the database successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

export default sequelize;
