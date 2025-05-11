import { connectDB } from '@/lib/dbConnect'
import AirportService from '@/models/AirportService'

export async function POST(req) {
  await connectDB()
  const data = await req.json()
  let service
  if (data._id) {
    service = await AirportService.findByIdAndUpdate(data._id, data, { new: true })
  } else {
    service = await AirportService.create(data)
  }
  return Response.json({ success: true, service })
}

export async function GET() {
  await connectDB()
  const services = await AirportService.find().sort({ createdAt: -1 })
  return Response.json({ services })
}
