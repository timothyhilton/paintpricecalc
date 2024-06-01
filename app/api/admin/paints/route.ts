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
  await pool.query('INSERT INTO Paints (name, brandId, coverage_per_litre) VALUES (?, ?, ?)', [paint.name, paint.brandId, paint.coverage_per_litre])
  return NextResponse.json({ message: 'Paint created' })
}

