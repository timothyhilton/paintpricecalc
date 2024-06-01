import { NextResponse } from 'next/server'
import pool from '@/app/db'

export async function PUT(req: Request, { params }: { params: { paintId: string } }) {
  const { name, coverage_per_litre, brandId } = await req.json()
  await pool.query('UPDATE Paints SET name = ?, coverage_per_litre = ?, brandId = ? WHERE paintId = ?', [name, coverage_per_litre, brandId, params.paintId])
  return NextResponse.json({ message: 'Paint updated' })
}

export async function DELETE(req: Request, { params }: { params: { paintId: string } }) {
  await pool.query('DELETE FROM Paints WHERE paintId = ?', [params.paintId])
  return NextResponse.json({ message: 'Paint deleted' })
}