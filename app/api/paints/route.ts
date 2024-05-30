import { NextResponse } from 'next/server'
import pool from '@/app/db'

interface Container {
  containerId: number;
  size: number;
  price: number;
}

interface Paint {
  paintId: number;
  name: string;
  coverage_per_litre: number;
  brandName: string;
  url: string;
  containers: Container[];
}

export async function GET() {
  try {
    const [paints] = await pool.query(`
      SELECT 
        Paints.paintId,
        Paints.name,
        Paints.coverage_per_litre,
        Brands.name AS brandName,
        Brands.website AS url,
        GROUP_CONCAT(CONCAT(Containers.containerId, ',', Containers.size, ',', Containers.price) SEPARATOR '|') AS containers
      FROM Paints
      JOIN Brands ON Paints.brandId = Brands.brandId
      JOIN Containers ON Paints.paintId = Containers.paintId
      GROUP BY Paints.paintId
    `) as { [key: string]: any }[];

    const parsedPaints: Paint[] = paints.map((paint: any) => ({
      ...paint,
      coverage_per_litre: parseFloat(paint.coverage_per_litre),
      containers: paint.containers.split('|').map((container: string) => {
        const [containerId, size, price] = container.split(',')
        return {
          containerId: parseInt(containerId),
          size: parseInt(size),
          price: parseFloat(price),
        }
      }),
    }))

    return NextResponse.json(parsedPaints)
  } catch (error) {
    console.error('Error fetching paints:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
