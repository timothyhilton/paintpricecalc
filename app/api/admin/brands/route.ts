import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function GET() {
  const [brands] = await pool.query('SELECT * FROM Brands')
  return NextResponse.json(brands)
}

export async function POST(req: Request) {
  const brand = await req.json()
  await pool.query('INSERT INTO Brands SET ?', brand)
  return NextResponse.json({ message: 'Brand created' })
}

export async function PUT(req: Request, { params }: { params: { brandId: string } }) {
  const { name, address, city, state, postcode, mobile, phone, website } = await req.json()
  await pool.query('UPDATE Brands SET name = ?, address = ?, city = ?, state = ?, postcode = ?, mobile = ?, phone = ?, website = ? WHERE brandId = ?', 
    [name, address, city, state, postcode, mobile, phone, website, params.brandId])
  return NextResponse.json({ message: 'Brand updated' })
}

export async function DELETE(req: Request, { params }: { params: { brandId: string } }) {
  await pool.query('DELETE FROM Brands WHERE brandId = ?', [params.brandId])
  return NextResponse.json({ message: 'Brand deleted' })
}
