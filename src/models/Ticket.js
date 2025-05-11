const mongoose = require('mongoose')

const TicketSchema = new mongoose.Schema({
  userId: String,
  ticketNo: String,
  airline: String,
  travelDate: Date,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  remindersSent: {
    type: [String], // e.g. ['24h', '5h']
    default: []
  }
}, { timestamps: true })

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema)
