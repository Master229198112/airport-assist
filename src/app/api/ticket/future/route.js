import { connectDB } from '@/lib/dbConnect'
import Ticket from '@/models/Ticket'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const token = (await cookies()).get('token')?.value
  const decoded = verifyToken(token || '')

  const tickets = await Ticket.find({
    userId: decoded.userId,
    travelDate: { $gt: new Date() },
    coordinates: { $ne: null }
  }).sort({ travelDate: 1 })

  return Response.json({ tickets })
}
