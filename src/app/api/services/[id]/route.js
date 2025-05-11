import { connectDB } from '@/lib/dbConnect'
import AirportService from '@/models/AirportService'

export async function DELETE(_, { params }) {
  await connectDB()
  await AirportService.findByIdAndDelete(params.id)
  return Response.json({ success: true })
}
