const express = require('express');
const app = express();

const cors = require('cors');



require('dotenv').config()

const port = process.env.PORT || 5000;
const SSKEY = process.env.SSKEY;
const DB = process.env.DB;



app.use(express.json());
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});

app.use(cors({origin: 'http://localhost:5173'}));

// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// // Impostazioni di Swagger
// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'API di esempio',
//       version: '1.0.0',
//       description: 'Un esempio di API usando Swagger e Express',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//       },
//     ],
//   },
//   apis: ['./index.js'], // Questo specifica dove trovare i commenti/documentazione
// };

// // Genera la documentazione Swagger
// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// /**
//  * @swagger
//  * /:
//  *   get:
//  *     summary: Ritorna un messaggio di benvenuto
//  *     responses:
//  *       200:
//  *         description: Successo
//  */
// app.get('/', (req, res) => {
//   res.send('Benvenuto nella mia API!');
// });

// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Ritorna la lista degli utenti
//  *     responses:
//  *       200:
//  *         description: Lista degli utenti
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                     example: 1
//  *                   name:
//  *                     type: string
//  *                     example: Mario Rossi
//  */
// app.get('/users', (req, res) => {
//   const users = [
//     { id: 1, name: 'Mario Rossi' },
//     { id: 2, name: 'Giulia Verdi' },
//   ];
//   res.json(users);
// });

//EFFECTIVE API

const mongoose = require('mongoose');

// Connetti a MongoDB (senza opzioni deprecate)
mongoose.connect(DB)
  .then(() => console.log('Connesso a MongoDB'))
  .catch((error) => console.error('Errore nella connessione a MongoDB:', error));

const User = require('./models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


app.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  // Verifica che tutti i campi siano forniti
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username già esistente' });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creazione di un nuovo utente
    const newUser = new User({
      username,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (error) {
    console.error('Errore nella registrazione:', error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Login degli utenti (sia admin che user)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trova l'utente nel database
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Utente non trovato' });

    // Confronta la password inserita con quella salvata
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Password errata' });

    // Crea un token JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, SSKEY, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il login' });
  }
});


const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accesso negato' });

  try {
    const verified = jwt.verify(token, SSKEY);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Token non valido' });
  }
};


const Ticket = require('./models/Ticket');
const TicketInfo = require('./models/TicketInfo');

// Creazione di un nuovo ticket
app.post('/tickets', authenticateToken, async (req, res) => {
  const { title, subject, location, description, photos } = req.body;

  try {

    //create ticket
    const newTicket = new Ticket({
      user: req.user.userId, // Associa il ticket all'utente autenticato
      title,
      subject,
      location,
      description,
      photos
    });

    //SAVES IT 
    await newTicket.save()
      .then(ticket => {

        // After the ticket is created, create the additional info
        const ticketInfo = new TicketInfo({
          ticket: ticket._id,
          priority: "high",
          plannedDate: new Date("2024-10-30"),
          assignedTo: null,
          notes: ["Initial diagnostic completed"],
        });

        return ticketInfo.save()
          .then(info => {
            // Step 3: Update the ticket with the reference to the newly created TicketInfo
            ticket.ticketInfo = info._id;  // Set the `ticketInfo` field with the newly created TicketInfo ID
            return ticket.save();  // Save the ticket again with the updated reference
          });
      })
      .then(info => console.log("Ticket Info saved:", info))
      .catch(err => console.error(err));

    res.status(201).json(newTicket);

  } catch (error) {
    res.status(500).json({ error: 'Errore nella creazione del ticket' });
  }
});


// Visualizza tutti i ticket con possibilità di filtraggio
app.get('/tickets', authenticateToken, async (req, res) => {
  const { status, startDate, endDate } = req.query;

  try {
    let filter = {};
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    await Ticket.find(filter)
      .populate('ticketInfo')  // Populate the `ticketInfo` field for all tickets
      .then(tickets => {
        res.json(tickets)
      })
      .catch(err => console.error("Error retrieving tickets:", err));


  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei ticket' });
  }
});


// Aggiornare lo stato di un ticket (solo admin)
app.put('/tickets/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Accesso negato' });

  const { status } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!ticket) return res.status(404).json({ error: 'Ticket non trovato' });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Errore nell\'aggiornamento del ticket' });
  }
});
