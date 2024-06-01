import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/db'
import bcrypt from 'bcrypt'
import { serialize } from 'cookie'

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  try {
    const [result] = await pool.query('SELECT * FROM Users WHERE username = ?', [username]) as any[];
    const user = result[0]

    if (user && await bcrypt.compare(password, user.passwordHash)) {
      const cookie = serialize('currentUser', username, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      })
      const isAdminCookie = serialize('isAdmin', user.isStaff ? 'true' : 'false', {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      })
      const response = NextResponse.json({ success: true })
      response.headers.set('Set-Cookie', cookie)
      response.headers.append('Set-Cookie', isAdminCookie)
      return response
    } else {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}