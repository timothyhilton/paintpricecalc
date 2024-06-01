import { NextRequest, NextResponse } from 'next/server'
import pool from '@/app/db'

export async function GET() {
  const [users] = await pool.query('SELECT userId, username FROM Users')
  return NextResponse.json(users)
}

export async function DELETE(req: NextRequest) {
  const { userId } = await req.json()
  await pool.query('DELETE FROM Users WHERE userId = ?', [userId])
  return NextResponse.json({ success: true })
}