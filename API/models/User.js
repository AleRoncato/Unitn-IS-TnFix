const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true }, // Definiamo i ruoli: admin o user
});

module.exports = mongoose.model('User', userSchema);
