"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  const router = useRouter()

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-center text-4xl font-bold mb-8">Admin Panel</h1>
      <div className="space-x-4">
        <Button onClick={() => router.push('/admin/users')}>Users</Button>
        <Button onClick={() => router.push('/admin/brands')}>Brands</Button>
        <Button onClick={() => router.push('/admin/paints')}>Paints</Button>
        <Button onClick={() => router.push('/admin/containers')}>Containers</Button>
      </div>
    </div>
  )
}

