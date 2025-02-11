// Importa mongoose
const mongoose = require("mongoose");

// Middleware per aggiornare `updatedAt` prima di salvare

// Definizione del modello Ticket
const TicketSchema = new mongoose.Schema(
  {
    creatore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tecnicoGestore: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lavoratoreAssegnato: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    title: { type: String, required: true },
    type: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: String, required: true },
    room: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: [String], default: [] },

    state: {
      type: String,
      enum: [
        "In accettazione",
        "Accettato",
        "Rifiutato",
        "Programmato",
        "Confermare",
        "In risoluzione",
        "Closed",
      ],
      default: "In accettazione",
    },

    declineReason: { type: String, default: "" },

    plannedDate: { type: Date, default: null },
    extimatedTime: { type: Number, default: 0 },

    inizio: { type: Date, default: null },
    fine: { type: Date, default: null },

    expiresIn: { type: Date, default: null }, // When the ticket expires

    updatedAt: { type: Date, default: Date.now }, // When the ticket was last updated
    createdAt: { type: Date, default: Date.now }, // When the ticket was created
  },
  { timestamps: true }
);

TicketSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Definizione del modello User
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ruolo: {
      type: String,
      enum: ["tecnico", "user", "admin", "worker"],
      required: true,
    },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    image: { type: String, default: "" },
    azienda: { type: String, default: "" },
    last_action: { type: Date, default: Date.now }, //Updated when the user leaves the updates page
  },
  { timestamps: true }
);

// Definizione del modello Place
const PlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    floors: [
      {
        floor: { type: String, required: true },
        rooms: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

// Definizione del modello Follow
const FollowSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
  },
  { timestamps: true }
);

// Creazione dei modelli
const Ticket = mongoose.model("Ticket", TicketSchema);
const ClosedTickets = mongoose.model("ClosedTickets", TicketSchema);
const User = mongoose.model("User", UserSchema);
const Place = mongoose.model("Place", PlaceSchema);
const Follow = mongoose.model("Follow", FollowSchema);

// Esportazione dei modelli
module.exports = { Ticket, ClosedTickets, User, Place, Follow };
