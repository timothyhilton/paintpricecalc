import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/db'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  const { username, password, email, phone } = await req.json()

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new user into the database
    await pool.query(
      'INSERT INTO Users (username, passwordHash, email, phone, userType) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, email, phone, "regular"]
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error during registration:', error)
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Username or email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}