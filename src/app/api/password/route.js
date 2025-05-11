import { connectDB } from '@/lib/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function POST(req) {
  await connectDB()
  const token = (await cookies()).get('token')?.value
  const decoded = verifyToken(token || '')
  const user = await User.findById(decoded.userId)
  const { currentPassword, newPassword } = await req.json()

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) {
    return Response.json({ message: 'Incorrect current password' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(newPassword, 10)
  user.password = hashed
  await user.save()

  return Response.json({ message: 'Password updated successfully' })
}
