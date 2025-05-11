import mongoose from 'mongoose'

const AirportServiceSchema = new mongoose.Schema({
  name: String,
  type: String, // e.g., 'Food', 'Experience', 'Lounge'
  description: String,
  openTime: String,
  closeTime: String,
  location: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true })

export default mongoose.models.AirportService || mongoose.model('AirportService', AirportServiceSchema)
