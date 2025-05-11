import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/crypto';

export async function POST(req) {
  await connectDB();
  const { name, age, email, mobile, personalId, passportNumber, password } = await req.json();

  console.log("📥 Registration input:", { name, age, email, mobile, personalId, passportNumber })

  if (!personalId || !passportNumber) {
    return Response.json({ error: 'ID Card and Passport are required' }, { status: 400 })
  }

  const existing = await User.findOne({ email });
  if (existing) return Response.json({ error: 'Email already registered' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);

  const encryptedPassport = encrypt(passportNumber)
  const encryptedId = encrypt(personalId)
  
  console.log('🧾 Data to be saved:', {
    name, age, email, mobile,
    password: hashedPassword,
    passportNumber: encryptedPassport,
    personalId: encryptedId
  })
  
  // ✅ Now create and assign to `user`
  const user = await User.create({
    name,
    age,
    email,
    mobile,
    password: hashedPassword,
    passportNumber: encryptedPassport,
    personalId: encryptedId,
  });
  
  return Response.json({ success: true, userId: user._id });
}
