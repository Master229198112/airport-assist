const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: { type: String, unique: true },
  mobile: String,
  password: String, // hashed
  passportNumber: String, // encrypted
  personalId: String,     // encrypted
}, { timestamps: true });

// Force schema to always reload in dev (fix for model cache)
delete mongoose.models.User;

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)
