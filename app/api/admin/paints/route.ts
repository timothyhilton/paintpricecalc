import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function GET() {
  const [paints] = await pool.query(`
    SELECT Paints.*, Brands.name as brandName 
    FROM Paints 
    LEFT JOIN Brands ON Paints.brandId = Brands.brandId
  `)
  return NextResponse.json(paints)
}

export async function POST(req: Request) {
  const paint = await req.json()
  await pool.query('INSERT INTO Paints SET ?', paint)
  return NextResponse.json({ message: 'Paint created' })
}

