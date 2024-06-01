import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function PUT(req: Request, { params }: { params: { paintId: string } }) {
  const paint = await req.json()
  await pool.query('UPDATE Paints SET ? WHERE paintId = ?', [paint, params.paintId])
  return NextResponse.json({ message: 'Paint updated' })
}

export async function DELETE(req: Request, { params }: { params: { paintId: string } }) {
  await pool.query('DELETE FROM Paints WHERE paintId = ?', [params.paintId])
  return NextResponse.json({ message: 'Paint deleted' })
}