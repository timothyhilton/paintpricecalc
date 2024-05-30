'use client'

import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Container, Paint } from '@/app/types/paint'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CalculatePage() {
    const searchParams = useSearchParams()
    const totalSquareMeters = parseFloat(searchParams.get('totalSquareMeters') || '0')
  
    const { data: paints, error } = useSWR<Paint[]>('/api/paints', fetcher)
  
    if (error) return <div>Failed to load paints</div>
    if (!paints) return <div>Loading...</div>
  
    return (
      <div className="container mx-auto mt-28 mb-8">
        <h1 className="text-4xl font-bold mb-8">Paint Options</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paints.map((paint) => (
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
                  <p>{(totalSquareMeters / paint.coverage_per_litre).toFixed(2)} L</p>
                </div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold mb-2">Recommended Purchase:</h2>
                  {getRecommendedPurchase(paint, totalSquareMeters).map(({ size, quantity, price }) => (
                    <p key={size}>
                      {quantity} x {size}L can(s) - ${price.toFixed(2)} each
                    </p>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    Total: ${calculateTotalCost(getRecommendedPurchase(paint, totalSquareMeters)).toFixed(2)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
}

function getRecommendedPurchase(paint: Paint, totalSquareMeters: number) {
    const litresNeeded = totalSquareMeters / paint.coverage_per_litre
    const combinations = getCombinations(paint.containers, litresNeeded)
    
    if (combinations.length === 0) {
      return []
    }
  
    const cheapestCombination = combinations.reduce((prev, curr) => {
      const prevTotalCost = calculateTotalCost(prev)
      const currTotalCost = calculateTotalCost(curr)
      return prevTotalCost < currTotalCost ? prev : curr
    })
  
    return cheapestCombination
}

function calculateTotalCost(combination: Container[]) {
  return combination.reduce((total, { price, quantity }) => total + price * (quantity || 0), 0)
}
  
function getCombinations(containers: Container[], litresNeeded: number): Container[][] {
    const combinations: Container[][] = []

    function backtrack(combination: Container[], remainingLitres: number, startIndex: number) {
        if (remainingLitres <= 0) {
        combinations.push(combination)
        return
        }

        for (let i = startIndex; i < containers.length; i++) {
        const container = containers[i]
        const quantity = Math.ceil(remainingLitres / container.size)
        
        backtrack(
            [...combination, { ...container, quantity }], 
            remainingLitres - quantity * container.size,
            i
        )
        }
    }

    backtrack([], litresNeeded, 0)
    return combinations
}