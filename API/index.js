const app = require("./app.js");
const mongoose = require("mongoose");

require("dotenv").config();
const DB = process.env.DB;
const port = process.env.PORT || 5000;

// Connessione a MongoDB
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connected to MongoDB Database");

    app.listen(port, () => {
      console.log(
        `Server listening on port ${port}, at http://localhost:${port}`
      );
    });

    // Impostazioni di Swagger
    const swaggerJsdoc = require("swagger-jsdoc");
    const swaggerUi = require("swagger-ui-express");
    const fs = require("fs");
    const yaml = require("js-yaml");

    const swaggerOptions = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "API TNFix",
          version: "2.2.0",
          description: "API per la gestione di ticket di assistenza e utenti",
          contact: {
            name: "Gianluca Campi",
          },
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        servers: [
          {
            url: "http://localhost:5000",
          },
        ],
      },
      apis: ["./app.js"],
    };

    // Genera la documentazione Swagger
    const swaggerDocs = swaggerJsdoc(swaggerOptions);

    // Converti la documentazione Swagger in formato YAML
    const swaggerYaml = yaml.dump(swaggerDocs);

    // Scrivi il file YAML
    fs.writeFileSync("../Documentazione/API/swagger.yaml", swaggerYaml, "utf8");

    // Mostra la documentazione Swagger all'indirizzo /api-docs
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    console.log(
      `Swagger documentation available at http://localhost:${port}/api-docs`
    );
  })
  .catch((error) =>
    console.error("Errore nella connessione a MongoDB:", error)
  );

// Exporta app e server per i test
module.exports = app;
