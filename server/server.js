import express from "express";
import pkg from "pg"; // Importer le module pg par défaut
const { Pool } = pkg; // Extraire Pool du package
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

// Configurer CORS
app.use(cors());
app.use(express.json());

// Créer une instance du pool de connexions PostgreSQL
const pool = new Pool({
  user: "postgres", // Utilisateur par défaut pour PostgreSQL
  host: "localhost", // Hôte par défaut pour PostgreSQL
  database: "otra",
  password: "Dave1979",
  port: 5432, // Port par défaut pour PostgreSQL
});

// Endpoint pour récupérer les voyages
app.get("/ontheroadagain/api/me/trips", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trip"); // Remplacez "trip" par le nom de votre table
    res.json(result.rows); // Renvoie les lignes de la requête sous forme de JSON
  } catch (error) {
    console.error("Erreur lors de la récupération des voyages:", error);
    res.status(500).send("Erreur lors de la récupération des voyages");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
