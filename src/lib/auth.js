import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET = process.env.JWT_SECRET || 'supersecret';

export function createToken(userId) {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function setLoginCookie(userId) {
  const token = createToken(userId);
  cookies().set('token', token, { httpOnly: true, path: '/' });
}

export function clearLoginCookie() {
  cookies().set('token', '', { maxAge: 0, path: '/' });
}
