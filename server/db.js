// db.js
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.PG_URL,
});

pool.on("connect", () => {
  console.log("Connected to the PostgreSQL database");
});

export default pool;
