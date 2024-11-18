const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relazione con User
  title: { type: String, required: true },
  subject: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  photos: { type: [String], required: false, default: null },

  status: {
    type: String,
    enum: ['open', 'planned', 'in progress', 'closed', 'cancelled'],
    default: 'open'
  },  // Ticket status

  createdAt: { type: Date, default: Date.now },  // When the ticket was created
  updatedAt: { type: Date, default: Date.now },  // When the ticket was last updated

  // Reference to the additional ticket information
  ticketInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketInfo', required: true }  // Link to TicketInfo
});

// Middleware to update `updatedAt` before saving
ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const TicketModel = mongoose.model('Ticket', ticketSchema);

module.exports = TicketModel;



