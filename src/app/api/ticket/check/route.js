// src\app\api\ticket\check\route.js

import { connectDB } from '@/lib/dbConnect'
import Ticket from '@/models/Ticket'

export async function POST(req) {
  await connectDB()
  const { ticketNo } = await req.json()
  const ticket = await Ticket.findOne({ ticketNo })

  if (!ticket) {
    return Response.json({ error: 'Ticket not found' }, { status: 404 })
  }

  return Response.json(ticket)
}
