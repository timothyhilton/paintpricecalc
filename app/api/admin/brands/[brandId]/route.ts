import pool from "@/app/db"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: { brandId: string } }) {
    try {
      const { name, address, city, state, postcode, mobile, phone, website } = await req.json()
      await pool.query('UPDATE Brands SET name = ?, address = ?, city = ?, state = ?, postcode = ?, mobile = ?, phone = ?, website = ? WHERE brandId = ?', 
        [name, address, city, state, postcode, mobile, phone, website, params.brandId])
      return NextResponse.json({ message: 'Brand updated' })
    } catch (error) {
      console.error('Failed to update brand:', error)
      return NextResponse.json({ message: 'Failed to update brand' }, { status: 500 })
    }
}
  
export async function DELETE(req: Request, { params }: { params: { brandId: string } }) {
    try {
        await pool.query('DELETE FROM Brands WHERE brandId = ?', [params.brandId])
        return NextResponse.json({ message: 'Brand deleted' })
    } catch (error) {
        console.error('Failed to delete brand:', error)
        return NextResponse.json({ message: 'Failed to delete brand' }, { status: 500 })
    }
}