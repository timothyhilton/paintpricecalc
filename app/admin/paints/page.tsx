"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Brand, Paint } from '@/app/types/paint'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'

export default function AdminPaintsPage() {
  const router = useRouter()
  const [paints, setPaints] = useState<Paint[]>([])
  const [editingPaint, setEditingPaint] = useState<Paint>({
    paintId: 0,
    name: '',
    coverage_per_litre: 0,
    brandId: 0,
    brandName: '',
    url: '',
    containers: []
  })
  const [isOpen, setIsOpen] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetchPaints()
    fetchBrands()
  }, [])

  async function fetchPaints() {
    try {
      const res = await fetch('/api/admin/paints')
      const data = await res.json()
      setPaints(data)
    } catch (error) {
      console.error('Failed to fetch paints:', error)
    }
  }

  async function fetchBrands() {
    try {
      const res = await fetch('/api/admin/brands')
      const data = await res.json()
      setBrands(data)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

  async function createPaint(paint: Paint) {
    try {
      await fetch('/api/admin/paints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paint),
      })
      fetchPaints()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create paint:', error)
    }
  }

  async function updatePaint(paint: Paint) {
    try {
      await fetch(`/api/admin/paints/${paint.paintId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paint),
      })
      fetchPaints()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update paint:', error)
    }
  }

  async function deletePaint(paintId: number) {
    try {
      await fetch(`/api/admin/paints/${paintId}`, { method: 'DELETE' })
      fetchPaints()
    } catch (error) {
      console.error('Failed to delete paint:', error)
    }
  }

  return (
    <div className="container mx-auto mt-28 mb-8">
      <div className="flex space-x-6">
        <h1 className="text-4xl font-bold mb-8">Admin Paints</h1>
        <Button onClick={() => router.push("/admin")}>Back</Button>
        <Button onClick={() => {
          setEditingPaint({
            paintId: 0,
            name: '',
            coverage_per_litre: 0,
            brandId: 0,
            brandName: '',
            url: '',
            containers: []
          })
          setIsOpen(true)
        }}>
          Create Paint
        </Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Coverage (m² / litre)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paints.map((paint) => (
            <TableRow key={paint.paintId}>
              <TableCell>{paint.paintId}</TableCell>
              <TableCell>{paint.name}</TableCell>
              <TableCell>{paint.brandName}</TableCell>
              <TableCell>{paint.coverage_per_litre} m²/L</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingPaint(paint)
                    setIsOpen(true)
                  }}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="outline"
                  onClick={() => deletePaint(paint.paintId)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPaint.paintId ? 'Edit Paint' : 'Create Paint'}</DialogTitle>
            <DialogDescription>
              {editingPaint.paintId
                ? 'Update paint details here.'
                : 'Enter new paint details here.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Paint Name</label>
              <Input
                value={editingPaint.name}
                onChange={(e) =>
                  setEditingPaint({ ...editingPaint, name: e.target.value })
                }
                placeholder="Paint name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Coverage (m² / litre)</label>
              <Input
                value={editingPaint.coverage_per_litre.toString()}
                onChange={(e) =>
                  setEditingPaint({ ...editingPaint, coverage_per_litre: parseFloat(e.target.value) })
                }
                placeholder="Coverage per litre"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand</label>
              <Select
                value={editingPaint.brandId.toString()}
                onValueChange={(value) =>
                  setEditingPaint({ ...editingPaint, brandId: parseInt(value) })
                }
              >
                <SelectTrigger className="border rounded p-2">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Brands</SelectLabel>
                    {brands.map((brand) => (
                      <SelectItem key={brand.brandId} value={brand.brandId.toString()}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingPaint.paintId) {
                  updatePaint(editingPaint);
                } else {
                  createPaint(editingPaint);
                }
              }}
            >
              {editingPaint.paintId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
