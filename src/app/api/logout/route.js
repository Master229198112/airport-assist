import { clearLoginCookie } from '@/lib/auth';

import { cookies } from 'next/headers'

export async function POST() {
  // Clear token cookie
  cookies().set('token', '', {
    maxAge: 0,
    path: '/',
  })

  return Response.json({ success: true })
}
