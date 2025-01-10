// Importa mongoose
const mongoose = require("mongoose");

// Definizione del modello Ticket
const TicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: String, required: true },
    room: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: [String], default: [] },

    ticketInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketInfo",
      required: false,
    }, // Link to TicketInfo

    createdAt: { type: Date, default: Date.now }, // When the ticket was created
  },
  { timestamps: true }
);



// Definizione del modello TicketInfo
const TicketInfoSchema = new mongoose.Schema(
  {
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    state: { type: String, default: "In accettazione" },
    plannedDate: { type: Date, default: null },
    inizio: { type: Date, default: null },
    fine: { type: Date, default: null },
    creatore: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tecnicoGestore: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    lavoratoreAssegnato: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    updatedAt: { type: Date, default: Date.now }, // When the ticket was last updated
  },
  { timestamps: true }
);

// Middleware per aggiornare `updatedAt` prima di salvare
TicketInfoSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
  });

// Definizione del modello User
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    ruolo: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    nome: { type: String, required: true },
    cognome: { type: String, required: true },
    last_action: { type: Date, default: Date.now }, //Updated when the user leaves the updates page
  },
  { timestamps: true }
);

// Definizione del modello Place
const PlaceSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },
    piani: [
      {
        piano: { type: String, required: true },
        stanze: [{ type: String }],
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
const TicketInfo = mongoose.model("TicketInfo", TicketInfoSchema);
const User = mongoose.model("User", UserSchema);
const Place = mongoose.model("Place", PlaceSchema);
const Follow = mongoose.model("Follow", FollowSchema);

// Esportazione dei modelli
module.exports = { Ticket, TicketInfo, User, Place, Follow };
