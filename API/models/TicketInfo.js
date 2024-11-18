const mongoose = require('mongoose');

// Define the schema for additional ticket information
const ticketInfoSchema = new mongoose.Schema({
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true },  // Link to Ticket
    priority: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'none' },  // Ticket priority
    plannedDate: { type: Date, default: null },  // Planned resolution date
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},  // Who is handling the ticket
    notes: { type: [String], required: false, default: [] },  // Optional notes for updates or comments
    updatedAt: { type: Date, default: Date.now }  // When the information was last updated
});

// Pre-save middleware to update `updatedAt` field before saving
ticketInfoSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const TicketInfoModel = mongoose.model('TicketInfo', ticketInfoSchema);

module.exports = TicketInfoModel;
