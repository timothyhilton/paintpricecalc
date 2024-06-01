import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function PUT(req: Request, { params }: { params: { containerId: string } }) {
  const { size, price, paintId } = await req.json()
  await pool.query('UPDATE Containers SET size = ?, price = ?, paintId = ? WHERE containerId = ?', [size, price, paintId, params.containerId])
  return NextResponse.json({ message: 'Container updated' })
}

export async function DELETE(req: Request, { params }: { params: { containerId: string } }) {
  await pool.query('DELETE FROM Containers WHERE containerId = ?', [params.containerId])
  return NextResponse.json({ message: 'Container deleted' })
}