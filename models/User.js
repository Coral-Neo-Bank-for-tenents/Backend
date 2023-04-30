const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contact: {
    phoneNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String }
  }
});

module.exports = mongoose.model('User', userSchema);
