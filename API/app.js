const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

// Impostazioni del server
const port = process.env.PORT || 5000;
const SSKEY = process.env.SSKEY;
const DB = process.env.DB;

// app.listen(port, () => {
//   console.log(`Server in esecuzione su http://localhost:${port}`);
// });

// Middleware per il parsing del body
app.use(express.json());

// Abilita CORS solo per il frontend
app.use(cors({ origin: "http://localhost:5173" }));

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
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./index.js"],
  // Questo specifica dove trovare i commenti/documentazione
};

// Genera la documentazione Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Mostra la documentazione Swagger all'indirizzo /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ============= //
// EFFECTIVE API //
// ============= //

// Connetti a MongoDB
mongoose
  .connect(DB)
  .then(() => console.log("Connesso a MongoDB"))
  .catch((error) =>
    console.error("Errore nella connessione a MongoDB:", error)
  );

const User = require("./models/newModels").User; // Importa il modello User

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra un nuovo utente
 *     tags: [Utenti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *             properties:
 *               username:
 *                 type: string
 *                 description: Il nome utente dell'utente
 *               password:
 *                 type: string
 *                 description: La password dell'utente
 *               role:
 *                 type: string
 *                 description: Il ruolo dell'utente (es. admin, user)
 *     responses:
 *       201:
 *         description: Utente registrato con successo
 *       400:
 *         description: Richiesta non valida
 *       500:
 *         description: Errore interno del server
 */
app.post("/register", async (req, res) => {
  const { username, password, role, email, telefono, nome, cognome } = req.body;

  // Verifica che tutti i campi siano forniti
  if (!username || !password || !role || !email || !nome || !cognome) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  try {
    // Controlla se l'utente esiste già per username e email
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(400).json({ error: "Username già esistente" });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione di un nuovo utente
    const newUser = new User({
      username,
      password: hashedPassword,
      ruolo: role,
      email,
      telefono,
      nome,
      cognome,
      last_action: Date.now(),
    });

    await newUser.save();

    res.status(201).json({ message: "Utente registrato con successo" });
  } catch (error) {
    console.error("Errore nella registrazione:", error);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Effettua il login di un utente
 *     tags: [Utenti]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Il nome utente dell'utente
 *               password:
 *                 type: string
 *                 description: La password dell'utente
 *     responses:
 *       200:
 *         description: Login effettuato con successo
 *       400:
 *         description: Credenziali non valide
 *       500:
 *         description: Errore interno del server
 */
// Login degli utenti (sia admin che user)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trova l'utente nel database
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Utente non trovato" });

    // Confronta la password inserita con quella salvata
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Password errata" });

    // Crea un token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, SSKEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Errore durante il login" });
  }
});

// NEED to modify all the other stuff on the database referncing the user 
app.delete("/users/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOneAndDelete({ username });
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    res.json({ message: "Utente eliminato con successo" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Errore durante l'eliminazione dell'utente" });
  }
});

const authenticateToken = require("./middleware/AUTH"); // Correct the import

const Ticket = require("./models/newModels").Ticket; // Importa il modello Ticket
const TicketInfo = require("./models/newModels").TicketInfo; // Importa il modello TicketInfo
const Follow = require("./models/newModels").Follow; // Importa il modello Follow

app.post("/tickets", authenticateToken, async (req, res) => {
  const { title, type, building, floor, room, description, image } = req.body;

  try {
    if (!title || !type || !building || !floor || !room) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    const existingTicket = await Ticket.findOne({
      type,
      building,
      floor,
      room,
    });

    console.log(existingTicket);

    if (existingTicket) {
      // Aggiungi l'utente come follower del ticket
      const newFollow = new Follow({
        userId: req.user.userId,
        ticketId: existingTicket._id,
      });
      await newFollow.save();
      return res.status(201).json({
        message:
          "Ticket uguale già esistente, sei stato aggiunto come Follower.",
      });
    }

    const newTicket = new Ticket({
      title,
      type,
      building,
      floor,
      room,
      description,
      image,
    });

    await newTicket.save().then((ticket) => {
      const ticketInfo = new TicketInfo({
        ticketId: ticket._id,
        creatore: req.user.userId,
      });

      return ticketInfo.save().then((info) => {
        ticket.ticketInfo = info._id;
        return ticket.save();
      });
    });

    res.status(201).json({ message: "Ticket creato con successo." });
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione del ticket." });
  }
});

app.get("/updates", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const tickets = await Ticket.find({
      updatedAt: { $gt: user.last_action },
    }).populate("ticketInfo");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei ticket" });
  }
});

app.get("/tickets", authenticateToken, async (req, res) => {
  const { state } = req.query;

  if (!state) {
    return res.status(400).json({ error: "Lo state è obbligatorio" });
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (req.user.role === "worker" || req.user.role === "tecnico") {
    // MANAGING PART
    // gets all the tickets with the specified state

    try {
      const tickets = await Ticket.find({
        state: state,
      }).populate("ticketInfo");

      const paginatedTickets = tickets.slice(skip, skip + limit);

      // Returns the total number of tickets, the current page, the limit and the tickets
      res.json({
        total: tickets.length,
        page,
        limit,
        tickets: paginatedTickets,
      });
    } catch (error) {
      res.status(500).json({ error: "Errore nel recupero dei ticket" });
    }
  } else {
    // USER PART
    // Gets all the tickets that the user is following
    // and all the ones that the user created

    try {
      const followedTickets = await Follow.find({
        user: req.user.userId,
      }).populate("ticket");

      const createdTickets = await Ticket.find({
        "ticketInfo.creatore": req.user.userId,
        state: state,
      }).populate("ticketInfo");

      const allTickets = [
        ...followedTickets.map((f) => f.ticket),
        ...createdTickets,
      ];

      const paginatedTickets = allTickets.slice(skip, skip + limit);

      res.json({
        total: allTickets.length,
        page,
        limit,
        tickets: paginatedTickets,
      });
    } catch (error) {
      res.status(500).json({ error: "Errore nel recupero dei ticket" });
    }
  }
});

app.put("/tickets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { state, plannedDate, inizio, fine, worker } = req.body;

  try {
    const ticketInfo = await TicketInfo.findOne({
      ticketId: id,
    });

    if (!ticketInfo) {
      return res.status(405).json({ error: "Ticket non trovato" });
    }

    if (req.user.role === "user") {
      return res.status(403).json({ error: "Non sei autorizzato" });
    }

    if (state) ticketInfo.state = state;

    // Saves the user id of the worker or the technician
    // when state is "Accettato" or "In lavorazione"
    if (state == "Accettato") ticketInfo.tecnicoGestore = req.user.userId;

    if (state == "In lavorazione") {
      if (!worker)
        return res.status(400).json({ error: "Il lavoratore è obbligatorio" });
      ticketInfo.lavoratoreAssegnato = worker;
    }

    if (plannedDate) ticketInfo.plannedDate = plannedDate;
    if (inizio) ticketInfo.inizio = inizio;
    if (fine) ticketInfo.fine = fine;

    await ticketInfo.save();

    res.json({ message: "Ticket updated with success." });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento del ticket" });
  }
});

const Place = require("./models/newModels").Place; // Importa il modello Place

app.get("/places", async (req, res) => {
  try {
    // I posti sono un array di oggetti con il campo "name" e "floors"
    // floors è un array di oggetti con il campo "floor" e "rooms"
    // rooms è un array di stringhe
    const places = await Place.find();

    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei luoghi" });
  }
});

app.post("/places", authenticateToken, async (req, res) => {
  const { name, floors } = req.body;

  if (!name || !floors) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  //Floors deve essere un array di oggetti con il campo "floor" e "rooms"
  // floors: [
  //   {
  //     floor: 1,
  //     rooms: ["Room 101", "Room 102", "Room 103"],
  //   },
  //   {
  //     floor: 2,
  //     rooms: ["Room 201", "Room 202", "Room 203"],
  //   },
  // ],

  try {
    console.log(floors);
    const newPlace = new Place({
      name,
      floors: floors.map((floor) => ({
        piano: floor.floor,
        stanze: floor.rooms.map((room) => room),
      })),
    });

    console.log(newPlace);

    await newPlace.save();

    console.log("Done");
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione del luogo" });
  }
});

app.post("/follows", authenticateToken, async (req, res) => {
  const { ticketId } = req.body;

  try {
    const newFollow = new Follow({
      user: req.user.userId,
      ticket: ticketId,
    });

    await newFollow.save();
    res.status(201).json(newFollow);
  } catch (error) {
    res.status(500).json({ error: "Errore nel seguire il ticket" });
  }
});

// Viene triggerato ogni volta che un utente esce dalla pagina updates (per aggiornare last_action)

app.put("/users/:id", authenticateToken, async (req, res) => {
  //updates the last_action field of the user
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { last_action: Date.now() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }
    res.status(200).json({ message: "Utente aggiornato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento dell'utente" });
  }
});

// // Export the app and server for testing

const server = app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});

module.exports = { app, server };
