import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function GET() {
  try {
    const [brands] = await pool.query('SELECT * FROM Brands')
    return NextResponse.json(brands)
  } catch (error) {
    console.error('Failed to fetch brands:', error)
    return NextResponse.json({ message: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const brand = await req.json()
    await pool.query('INSERT INTO Brands SET ?', brand)
    return NextResponse.json({ message: 'Brand created' })
  } catch (error) {
    console.error('Failed to create brand:', error)
    return NextResponse.json({ message: 'Failed to create brand' }, { status: 500 })
  }
}