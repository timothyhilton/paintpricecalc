"use client"
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export default function RegisterPage() {
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
    const email = formData.get('email')
    const phone = formData.get('phone')

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, phone }),
    })

    if (response.ok) {
      router.push('/login')
    } else {
      const data = await response.json()
      setError(data.error || 'Something went wrong.')
    }
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-center text-4xl font-bold mb-8">Register</h1>
      <Card className="w-full max-w-md">
        <CardHeader className="mt-[-1.3rem]" />
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 mb-[-1.4rem]">
            {error && <div className="text-red-500">{error}</div>}
            <Input type="text" name="username" placeholder="Username" required />
            <Input type="password" name="password" placeholder="Password" required />
            <Input type="email" name="email" placeholder="Email" required />
            <Input type="text" name="phone" placeholder="Phone" />
          </CardContent>
          <Link href="/login" className="text-blue-500 text-xs ml-6">login instead</Link>
          <CardFooter className="flex justify-between items-center">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}