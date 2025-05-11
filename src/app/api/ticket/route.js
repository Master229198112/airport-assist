// src/app/api/ticket/route.js

import { connectDB } from '@/lib/dbConnect'
import Ticket from '@/models/Ticket'
import User from '@/models/User'
import cron from 'node-cron'
import { sendEmail, sendSMS } from '@/lib/notifier'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
  await connectDB()

  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const decoded = verifyToken(token || '')

  if (!decoded?.userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await User.findById(decoded.userId)
  const data = await req.json()

  // Save ticket with userId
  const ticket = await Ticket.create({ ...data, userId: decoded.userId })

  const travelTime = new Date(data.travelDate)
  const email = user.email
  const mobile = user.mobile

  // Send immediate confirmation for testing
  const confirmMsg = `🛫 Booking Confirmed for flight ${data.airline} on ${travelTime.toLocaleString()}`
  await sendEmail(email, '✅ Airport Ticket Booking Confirmed', confirmMsg)
  await sendSMS(mobile, confirmMsg)

  // Schedule Reminders
  function scheduleNotification(offsetMs, label) {
    const notifyTime = new Date(travelTime.getTime() - offsetMs)
    const cronTime = `${notifyTime.getUTCMinutes()} ${notifyTime.getUTCHours()} ${notifyTime.getUTCDate()} ${notifyTime.getUTCMonth() + 1} *`

    cron.schedule(cronTime, async () => {
      const msg = `📣 Reminder: Your flight (${data.airline}) is at ${travelTime.toLocaleString()}.`
      try {
        await sendEmail(email, `🛫 Travel Reminder – ${label}`, msg)
        await sendSMS(mobile, msg)
        console.log(`✅ Sent ${label} reminder`)
      } catch (err) {
        console.error(`❌ Reminder failed:`, err)
      }
    })
  }

  scheduleNotification(24 * 60 * 60 * 1000, '1 Day Before')
  scheduleNotification(5 * 60 * 60 * 1000, '5 Hours Before')
  scheduleNotification(1 * 60 * 60 * 1000, '1 Hour Before')

  return Response.json({ success: true, ticket })
}
