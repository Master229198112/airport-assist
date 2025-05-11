import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { connectDB } from '@/lib/dbConnect'
import User from '@/models/User'
import Ticket from '@/models/Ticket'
import AirportService from '@/models/AirportService'

export async function GET() {
  await connectDB()

  const cookieStore = await cookies()
  const token = await cookieStore.get('token')?.value || ''
  const data = verifyToken(token)

  let user = null
  let bookings = []

  if (data?.userId) {
    user = await User.findById(data.userId)
    bookings = await Ticket.find({ userId: data.userId }).sort({ travelDate: 1 })
  }

  const services = await AirportService.find().sort({ createdAt: -1 })
  return Response.json({ user, bookings, services })
}
