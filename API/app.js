const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();

// Impostazioni cripting
const SSKEY = process.env.SSKEY;

// Middleware per il parsing del body
app.use(express.json());

// Abilita CORS solo per il frontend
app.use(cors({ origin: "http://localhost:5173" }));

// ============= //
// EFFECTIVE API //
// ============= //

const User = require("./models/Models").User; // Importa il modello User

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticateToken = require("./middleware/AUTH"); // Correct the import

app.get("/", (req, res) => {
  res.send("API TNFix");
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *               nome:
 *                 type: string
 *               cognome:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
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
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /users/{UserId}:
 *   delete:
 *     summary: Delete a user by his ID
 *     parameters:
 *       - in: path
 *         name: UserId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.delete("/users/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user.role != "admin") {
    res.status(403).json({ error: "Non sei autorizzato" });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
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

const Ticket = require("./models/Models").Ticket; // Importa il modello Ticket
const TicketInfo = require("./models/Models").TicketInfo; // Importa il modello TicketInfo
const Follow = require("./models/Models").Follow; // Importa il modello Follow

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *               building:
 *                 type: string
 *               floor:
 *                 type: string
 *               room:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /updates:
 *   get:
 *     summary: Get updates for the user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   type:
 *                     type: string
 *                   building:
 *                     type: string
 *                   floor:
 *                     type: string
 *                   room:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   ticketInfo:
 *                     type: object
 *                     properties:
 *                       ticketId:
 *                         type: string
 *                       creatore:
 *                         type: string
 *                       state:
 *                         type: string
 *                       plannedDate:
 *                         type: string
 *                       inizio:
 *                         type: string
 *                       fine:
 *                         type: string
 *                       tecnicoGestore:
 *                         type: string
 *                       lavoratoreAssegnato:
 *                         type: string
 *       403:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
app.get("/updates", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(403).json({ error: "Utente non trovato" });
    }

    const tickets = await Ticket.find({
      updatedAt: { $gt: user.last_action },
    }).populate("ticketInfo");

    if (req.user.role === "tecnico") {
      const extraTickets = await Ticket.find({
        "ticketInfo.tecnicoGestore": req.user.userId,
        "ticketInfo.state": "Confermare",
      }).populate("ticketInfo");

      const acceptTickets = await Ticket.find({
        "ticketInfo.state": "In accettazione",
      }).populate("ticketInfo");

      const filteredTickets = tickets.filter(
        (ticket) =>
          ticket.ticketInfo.tecnicoGestore == req.user.userId &&
          ticket.ticketInfo.state != "Confermare"
      );

      res.json([...extraTickets, ...filteredTickets, ...acceptTickets]);
    } else if (req.user.role === "worker") {
      const filteredWorkerTickets = tickets.filter(
        (ticket) => ticket.ticketInfo.lavoratoreAssegnato == req.user.userId
      );

      res.json(filteredWorkerTickets);
    } else {
      UserTickets = tickets.filter(
        (ticket) => ticket.ticketInfo.creatore == req.user.userId
      );

      const followedTickets = await Follow.find({
        user: req.user.userId,
        "ticket.updatedAt": { $gt: user.last_action },
      }).populate("ticket");

      tickets = [...UserTickets, ...followedTickets.map((f) => f.ticket)];

      res.json(tickets);
    }
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei ticket" });
  }
});

/**
 * @swagger
 * /tickets/{state}:
 *   get:
 *     summary: Get ticket based on the state and the user role
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   type:
 *                     type: string
 *                   building:
 *                     type: string
 *                   floor:
 *                     type: string
 *                   room:
 *                     type: string
 *                   description:
 *                     type: string
 *                   image:
 *                     type: string
 *                   ticketInfo:
 *                     type: object
 *                     properties:
 *                       ticketId:
 *                         type: string
 *                       creatore:
 *                         type: string
 *                       state:
 *                         type: string
 *                       plannedDate:
 *                         type: string
 *                       inizio:
 *                         type: string
 *                       fine:
 *                         type: string
 *                       tecnicoGestore:
 *                         type: string
 *                       lavoratoreAssegnato:
 *                         type: string
 *       400:
 *         description: Lo state è obbligatorio
 *       500:
 *         description: Errore nel recupero dei ticket
 */
app.get("/tickets/:state", authenticateToken, async (req, res) => {
  const { state } = req.params;

  if (!state) {
    return res.status(400).json({ error: "Lo state è obbligatorio" });
  }

  // Paginazione dei risultati
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (req.user.role === "worker" || req.user.role === "tecnico") {
    try {
      const tickets = await Ticket.find({
        state: state,
      }).populate("ticketInfo");

      if (state != "In accettazione") {
        tickets = tickets.filter(
          (ticket) =>
            ticket.ticketInfo.tecnicoGestore == req.user.userId ||
            ticket.ticketInfo.lavoratoreAssegnato == req.user.userId
        );
      }

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

      const user = await User.findById(req.user.userId);

      user.last_action = Date.now();
      await user.save();

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

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update a ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *               inizio:
 *                 type: string
 *               fine:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not Authorized
 *       405:
 *         description: Ticket not found
 *       500:
 *         description: Errore nell'aggiornamento del ticket
 */
app.put("/tickets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { state, inizio, fine } = req.body;

  try {
    if (req.user.role === "user") {
      return res.status(403).json({ error: "Non sei autorizzato" });
    }

    const ticket = await Ticket.findOne({
      _id: id,
    });

    if (!ticket) {
      return res.status(405).json({ error: "Ticket non trovato" });
    }

    const ticketInfo = await TicketInfo.findOne({
      ticketId: id,
    });

    if (!ticketInfo) {
      return res.status(405).json({ error: "Ticket non trovato" });
    }

    if (state == "In risoluzione") {
      if (!inizio)
        return res.status(400).json({ error: "L'inizio è obbligatorio" });

      ticketInfo.inizio = inizio;
      ticketInfo.state = "In risoluzione";
    }

    if (state == "Closed") {
      if (!fine)
        return res.status(400).json({ error: "La fine è obbligatoria" });

      ticketInfo.fine = fine;

      if (req.user.role === "worker") {
        ticketInfo.state = "Confermare";
      } else {
        ticketInfo.state = "Closed";
      }
    }

    await ticketInfo.save();

    res.json({ message: "Ticket updated with success." });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'aggiornamento del ticket" });
  }
});

/**
 * @swagger
 * /tickets/{id}/schedule:
 *   put:
 *     summary: Schedule a ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *           type: object
 *           properties:
 *             plannedDate:
 *               type: date
 *             extimatedTime:
 *               type: number
 *             worker:
 *               type: string
 *     responses:
 *       200:
 *         description: Ticket scheduled successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Not Authorized
 *       405:
 *         description: Ticket not found
 *       500:
 *         description: Errore nella programmazione del ticket
 *
 *
 */
app.put("/tickets/:id/schedule", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { plannedDate, extimatedTime, worker } = req.body;

  try {
    const ticket = await Ticket.findOne({
      _id: id,
      state: "Accettato",
    });

    if (!ticket) {
      return res.status(403).json({ error: "Ticket non trovato" });
    }

    const ticketInfo = await TicketInfo.findOne({
      ticketId: id,
    });

    if (!plannedDate)
      return res
        .status(400)
        .json({ error: "La data programmata è obbligatoria" });

    ticketInfo.plannedDate = plannedDate;
    ticketInfo.extimatedTime = extimatedTime;

    if (worker) ticketInfo.lavoratoreAssegnato = worker;

    ticketInfo.state = "Programmato";

    await ticketInfo.save();

    res.json({ message: "Ticket programmato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nella programmazione del ticket" });
  }
});

/**
 * @swagger
 * /tickets/{id}/accept:
 *   put:
 *     summary: Accept a ticket by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket accepted successfully
 *       405:
 *         description: Ticket not found
 *       500:
 *         description: Errore nella programmazione del ticket
 *
 */
app.put("/tickets/:id/accept", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findOne({
      _id: id,
      state: "In accettazione",
    });

    if (!ticket) {
      return res.status(405).json({ error: "Ticket non trovato" });
    }

    const ticketInfo = await TicketInfo.findOne({
      ticketId: id,
    });

    ticketInfo.state = "Accettato";
    ticketInfo.tecnicoGestore = req.user.userId;

    await ticketInfo.save();

    res.json({ message: "Ticket accettato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nell'accettazione del ticket" });
  }
});

/**
 * @swagger
 * /tickets/{id}/decline:
 *   put:
 *     summary: Decline a ticket by ID given a reason
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *           type: object
 *           properties:
 *             declineReason:
 *               type: string
 *     responses:
 *       200:
 *         description: Ticket accepted successfully
 *       405:
 *         description: Ticket not found
 *       500:
 *         description: Errore nella programmazione del ticket
 *
 */
app.put("/tickets/:id/decline", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { declineReason } = req.body;

  try {
    const ticket = await Ticket.findOne({
      _id: id,
      state: "In accettazione",
    });

    if (!ticket) {
      return res.status(403).json({ error: "Ticket non trovato" });
    }

    const ticketInfo = await TicketInfo.findOne({
      ticketId: id,
    });

    ticketInfo.state = "Rifiutato";
    ticketInfo.tecnicoGestore = req.user.userId;
    ticketInfo.declineReason = declineReason;

    ticketInfo.expiresIn = Date.now() + 1000 * 60 * 60 * 24 * 14; // 14 days

    await ticketInfo.save();

    res.json({ message: "Ticket rifiutato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore nel rifiuto del ticket" });
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delets a ticket by ID if not already accepted and is created by the user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket eliminato con successo
 *       400:
 *         description: Ticket non trovato
 *       500:
 *         description: Errore durante l'eliminazione del ticket
 */
app.delete("/tickets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  user = req.user.userId;

  try {
    const ticket = await Ticket.findOne({
      _id: id,
      "ticketInfo.creatore": user,
      state: "In accettazione",
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket non trovato" });
    }

    ticketInfo = await TicketInfo.findByIdAndDelete(ticket.ticketInfo);
    await ticket.delete();

    res.json({ message: "Ticket eliminato con successo" });
  } catch (error) {
    res.status(500).json({ error: "Errore durante l'eliminazione del ticket" });
  }
});

const Place = require("./models/Models").Place; // Importa il modello Place

/**
 * @swagger
 * /places:
 *   get:
 *     summary: Get all places
 *     responses:
 *       200:
 *         description: Places retrieved successfully
 *         content:
 *           application/json:
 *            schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   floors:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         piano:
 *                           type: integer
 *                         stanze:
 *                           type: array
 *                           items:
 *                             type: string
 *       500:
 *         description: Internal server error
 */
app.get("/places", async (req, res) => {
  try {
    const places = await Place.find();

    res.json(places);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero dei luoghi" });
  }
});

/**
 * @swagger
 * /places:
 *   post:
 *     summary: Create a new place
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               floors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     floor:
 *                       type: integer
 *                     rooms:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Place created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
app.post("/places", authenticateToken, async (req, res) => {
  const { name, floors } = req.body;

  if (!name || !floors) {
    return res.status(400).json({ error: "Tutti i campi sono obbligatori" });
  }

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

/**
 * @swagger
 * /follows:
 *   post:
 *     summary: Follow a ticket
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Follow created successfully
 *       500:
 *         description: Internal server error
 */
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

module.exports = app;
