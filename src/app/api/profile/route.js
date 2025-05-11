import { connectDB } from '@/lib/dbConnect'
import User from '@/models/User'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { encrypt, decrypt } from '@/lib/crypto'

export async function GET() {
  try {
    await connectDB()
    const token = cookies().get('token')?.value
    const decoded = verifyToken(token || '')
    const user = await User.findById(decoded.userId)

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const result = {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      passportNumber: user.passportNumber ? decrypt(user.passportNumber) : '',
      personalId: user.personalId ? decrypt(user.personalId) : '',
    }

    return Response.json(result)
  } catch (err) {
    console.error('Profile GET error:', err)
    return Response.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const token = cookies().get('token')?.value
    const decoded = verifyToken(token || '')
    const user = await User.findById(decoded.userId)

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const data = await req.json()

    user.name = data.name
    user.email = data.email
    user.mobile = data.mobile
    if (data.passportNumber) user.passportNumber = encrypt(data.passportNumber)
    if (data.personalId) user.personalId = encrypt(data.personalId)

    await user.save()

    return Response.json({ message: 'Profile updated successfully' })
  } catch (err) {
    console.error('Profile POST error:', err)
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
