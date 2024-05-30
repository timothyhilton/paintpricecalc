'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container, Paint } from '@/app/types/paint'
import useSWR from 'swr'

// Fetcher function to get data from the API
const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CalculatePage() {
    const searchParams = useSearchParams()
    const totalSquareMeters = parseFloat(searchParams.get('totalSquareMeters') || '0')
  
    // Fetch paints data using SWR
    const { data: paints, error } = useSWR<Paint[]>('/api/paints', fetcher)
  
    if (error) return <div>Failed to load paints</div>
    if (!paints) return <div>Loading...</div>

    return (
      <div className="container mx-auto mt-28 mb-8">
        <h1 className="text-4xl font-bold mb-8">Paint Options</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paints.map((paint) => {
            const litresNeeded = totalSquareMeters / paint.coverage_per_litre
            const optimalContainers = calculateOptimalContainers(paint, litresNeeded)

            return (
              <Card key={paint.paintId}>
                <CardHeader>
                  <CardTitle>{paint.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p>
                      Brand: <a href={paint.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{paint.brandName}</a>
                    </p>
                    <p>Coverage per litre: {paint.coverage_per_litre} m²</p>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Litres Needed:</h2>
                    <p>{litresNeeded.toFixed(2)} L</p>
                  </div>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Recommended Purchase:</h2>
                    <ul>
                      {optimalContainers.map(({ container, quantity }) => (
                        <li key={container.containerId}>
                          {quantity} x {container.size}L (${container.price.toFixed(2)} each)
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      Total: ${optimalContainers.reduce((total, { container, quantity }) => total + container.price * quantity, 0).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    )
}

// Function to calculate the optimal number of containers needed
function calculateOptimalContainers(paint: Paint, litresNeeded: number): { container: Container; quantity: number }[] {
    // Sort containers by size in descending order
    const sortedContainers = paint.containers.sort((a, b) => b.size - a.size)
    const optimalContainers: { container: Container; quantity: number }[] = []

    // Round up litresNeeded to the nearest multiple of the smallest container size
    const smallestContainer = sortedContainers[sortedContainers.length - 1]
    console.log(smallestContainer.size)
    litresNeeded = Math.ceil(litresNeeded / smallestContainer.size) * smallestContainer.size

    // Calculate the number of each container size needed
    for (const container of sortedContainers) {
        const quantity = Math.floor(litresNeeded / container.size)
        if (quantity > 0) {
            optimalContainers.push({ container, quantity })
            litresNeeded -= quantity * container.size
        }
    }
    return optimalContainers
}