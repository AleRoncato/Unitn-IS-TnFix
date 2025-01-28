const app = require("./app.js");
const mongoose = require("mongoose");

require("dotenv").config();
const DB = process.env.DB;
const port = process.env.PORT || 5000;

// Connessione a MongoDB
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to Database");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });

    // Impostazioni di Swagger
    const swaggerJsDoc = require("swagger-jsdoc");
    const swaggerUi = require("swagger-ui-express");

    const swaggerOptions = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "API di esempio",
          version: "1.0.0",
          description: "Un esempio di API usando Swagger e Express",
        },
        servers: [
          {
            url: "http://localhost:8000",
          },
        ],
      },
      apis: ["./app.js"],
    };

    // Genera la documentazione Swagger
    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    // Mostra la documentazione Swagger all'indirizzo /api-docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  })
  .catch((error) =>
    console.error("Errore nella connessione a MongoDB:", error)
  );

// Exporta app e server per i test
module.exports = app;
