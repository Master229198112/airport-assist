import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { setLoginCookie } from '@/lib/auth';

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return Response.json({ error: 'User not found' }, { status: 401 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return Response.json({ error: 'Incorrect password' }, { status: 401 });

  setLoginCookie(user._id);
  return Response.json({ success: true, userId: user._id });
}
