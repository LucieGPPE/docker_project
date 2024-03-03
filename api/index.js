const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());

// Fonction pour attendre 10 secondes
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Connexion à la base de données MySQL après une pause de 10 secondes
(async () => {
  console.log(
    "Attente de 10 secondes avant de se connecter à la base de données..."
  );
  await wait(10000); // Attendre 10 secondes
  console.log("Connexion à la base de données...");
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    console.log("Connexion à la base de données MySQL établie");

    // Route pour créer un nouveau message
    app.post("/message", async (req, res) => {
      const { content, pseudo } = req.body;
      if (!content) {
        return res.status(400).json({ error: "Contenu du message manquant" });
      }

      try {
        await connection.execute(
          "INSERT INTO message (content, pseudo, date) VALUES (?, ?, ?)",
          [content, pseudo || "Anonyme", new Date()]
        );
        res.status(201).json({ message: "Message créé avec succès" });
      } catch (err) {
        console.error("Erreur lors de la création du message :", err);
        res
          .status(500)
          .json({ error: "Erreur lors de la création du message" });
      }
    });

    // Route pour récupérer tous les messages
    app.get("/message", async (req, res) => {
      try {
        const [rows] = await connection.execute("SELECT * FROM message");
        res.json(rows);
      } catch (err) {
        console.error("Erreur lors de la récupération des messages :", err);
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des messages" });
      }
    });

    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Erreur lors de la connexion à la base de données MySQL :",
      error
    );
    process.exit(1); // Quitte le processus Node.js en cas d'erreur de connexion à la base de données
  }
})();
