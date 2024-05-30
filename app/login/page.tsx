"use client"
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      router.push('/input')
    } else {
      const data = await response.json()
      setError(data.error || 'Something went wrong.')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-center text-4xl font-bold mb-8">Login</h1>
      <Card className="w-full max-w-md">
        <CardHeader className="mt-[-1.3rem]" />
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-[-1.4rem]">
            {error && <div className="text-red-500">{error}</div>}
            <Input type="text" name="username" placeholder="Username" required />
            <Input type="password" name="password" placeholder="Password" required />
          </CardContent>
          <Link href="/register" className="text-blue-500 text-xs ml-6">register instead</Link>
          <CardFooter className="flex justify-between items-center">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

