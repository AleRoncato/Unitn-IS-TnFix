const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

const mongoose = require("mongoose");

const port = process.env.PORT || 5000;
const SSKEY = process.env.SSKEY;
const DB = process.env.DB;

app.use(express.json());
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});

app.use(cors({ origin: "http://localhost:5173" }));

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Impostazioni di Swagger
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
  apis: ["./index.js"], // Questo specifica dove trovare i commenti/documentazione
};

// Genera la documentazione Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);
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
  const { username, password, role } = req.body;

  // Verifica che tutti i campi siano forniti
  if (!username || !password || !role) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username già esistente" });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione di un nuovo utente
    const newUser = new User({
      username,
      password: hashedPassword,
      role,
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

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Errore durante il login" });
  }
});

const authenticateToken = require("./middleware/AUTH");

// Viene triggerato ogni volta che un utente esce dalla pagina updates (per aggiornare last_action)

app.put("/users/:id", authenticateToken, async (req, res) => {
  //updates the last_action field of the user
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { last_action: Date.now() },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento dell'utente" });
  }
});

const Ticket = require("./models/newModels").Ticket; // Importa il modello Ticket
const TicketInfo = require("./models/newModels").TicketInfo; // Importa il modello TicketInfo

app.post("/tickets", authenticateToken, async (req, res) => {
  const { title, type, building, floor, room, description, image } = req.body;

  try {
    if (!title || !type || !building || !floor || !room ) {
      return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
    }

    const existingTicket = await Ticket.findOne({
      title,
      type,
      building,
      floor,
      room,
    });



    if (existingTicket) {
      // Aggiungi l'utente come follower del ticket
      const newFollow = new Follow({
        user: req.user.userId,
        ticket: existingTicket._id,
      });
      await newFollow.save();
      return res.status(200).json({ message: "Ticket uguale già esistente, sei stato aggiunto come Follower." });
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

    res.status(201).json({message:"Ticket creato con successo."});
  } catch (error) {
    res.status(500).json({ error: "Errore nella creazione del ticket." });
  }
});

const Follow = require("./models/newModels").Follow; // Importa il modello Follow

app.get("/updates", authenticateToken, async (req, res) => {
  try {
    // NEED TO CHANGE IT TO WORK
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "Utente non trovato" });

    const lastAction = user.last_action;

    const tickets = await Ticket.find().populate({
      path: "ticketInfo",
      match: { updatedAt: { $gt: lastAction } },
    });

    const updatedTickets = tickets.filter((ticket) => ticket.ticketInfo);

    res.json(updatedTickets);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei ticket" });
  }
});

app.get("/tickets", authenticateToken, async (req, res) => {
  const { status } = req.query;
  if (!status) {
    return res.status(400).json({ error: "Lo status è obbligatorio" });
  }
  // NEED TO CHANGE IT TO WORK
  try {
    const followedTickets = await Follow.find({
      user: req.user.userId,
    }).populate({ ticketId: { state: status } });

    const tickets = await Ticket.find().populate({
      TicketInfo: { $and: { state: status, creatore: req.user.userId } },
    });
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei ticket" });
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

app.post("/places", async (req, res) => {
  const { name, floors } = req.body;

  try {
    const newPlace = new Place({
      name,
      floors, //Deve essere un array di oggetti con il campo "floor" e "rooms"
    });

    await newPlace.save();
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
