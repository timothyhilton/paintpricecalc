import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function GET() {
  const [containers] = await pool.query(`
    SELECT Containers.*, Paints.name as paintName
    FROM Containers
    LEFT JOIN Paints ON Containers.paintId = Paints.paintId
  `)
  return NextResponse.json(containers)
}

export async function POST(req: Request) {
  const container = await req.json()
  await pool.query('INSERT INTO Containers (size, price, paintId) VALUES (?, ?, ?)', [container.size, container.price, container.paintId])
  return NextResponse.json({ message: 'Container created' })
}