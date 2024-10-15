import express from "express";
import cors from "cors";
import sequelize from "./db.js"; // Importer Sequelize en haut du fichier
import { router } from "./app/routers/index.js"; // Importer les routes

const app = express();
const port = process.env.PORT || 5000;

// Configurer CORS
app.use(cors());
app.use(express.json());

// Utiliser les routes
app.use("/ontheroadagain", router);

// Synchroniser la base de données
const startServer = async () => {
  try {
    // Synchroniser avec la base de données
    await sequelize.sync();
    console.log("Base de données synchronisée avec succès.");

    // Lancer le serveur
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(
      "Erreur lors de la synchronisation avec la base de données :",
      error
    );
  }
};

// Démarrer le serveur
startServer();
