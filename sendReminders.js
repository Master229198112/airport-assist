require('dotenv').config({ path: '.env.local' })
const mongoose = require('mongoose')
const { sendEmail, sendSMS } = require('./src/lib/notifier.js')
const Ticket = require('./src/models/Ticket.js')
const User = require('./src/models/User.js')

const REMINDER_OFFSETS = {
  '24h': 24 * 60 * 60 * 1000,
  '5h': 5 * 60 * 60 * 1000,
  '1h': 1 * 60 * 60 * 1000,
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')
  } catch (err) {
    console.error('❌ MongoDB connection failed', err)
    process.exit(1)
  }
}

const runReminders = async () => {
  const now = new Date()
  const tickets = await Ticket.find()

  for (const ticket of tickets) {
    const user = await User.findById(ticket.userId)
    if (!user || !ticket.travelDate) continue

    const timeToTravel = new Date(ticket.travelDate) - now

    for (const [label, offset] of Object.entries(REMINDER_OFFSETS)) {
      const delta = Math.abs(timeToTravel - offset)

      if (delta < 60000 && !ticket.remindersSent?.includes(label)) {
        const msg = `📣 Reminder: Your flight (${ticket.airline}) is at ${new Date(ticket.travelDate).toLocaleString()}.`
        try {
          await sendEmail(user.email, `🛫 Travel Reminder – ${label}`, msg)
          await sendSMS(user.mobile, msg)
          console.log(`✅ Sent ${label} reminder to ${user.email}`)

          if (!ticket.remindersSent) ticket.remindersSent = []
          ticket.remindersSent.push(label)
          await ticket.save()
        } catch (err) {
          console.error(`❌ Failed to send ${label} reminder`, err)
        }
      }
    }
  }

  console.log('🕑 Reminder check complete.')
}

const start = async () => {
  await connectDB()
  await runReminders()
  mongoose.disconnect()
}

start()
