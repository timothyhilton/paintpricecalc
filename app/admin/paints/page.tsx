"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Brand, Paint } from '@/app/types/paint'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminPaintsPage() {
  const [paints, setPaints] = useState<Paint[]>([])
  const [editingPaint, setEditingPaint] = useState<Paint | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetchPaints()
    fetchBrands()
  }, [])

  async function fetchPaints() {
    const res = await fetch('/api/admin/paints')
    const data = await res.json()
    setPaints(data)
  }

  async function fetchBrands() {
    const res = await fetch('/api/admin/brands')
    const data = await res.json()
    setBrands(data)
  }

  async function createPaint(paint: Paint) {
    await fetch('/api/admin/paints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paint),
    })
    fetchPaints()
    setIsOpen(false)
  }

  async function updatePaint(paint: Paint) {
    await fetch(`/api/admin/paints/${paint.paintId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paint),
    })
    fetchPaints()
    setIsOpen(false)
  }

  async function deletePaint(paintId: number) {
    await fetch(`/api/admin/paints/${paintId}`, { method: 'DELETE' })
    fetchPaints()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Paints</h1>
        <Button onClick={() => {
          setEditingPaint(null)
          setIsOpen(true)
        }}>Create Paint</Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Coverage</TableHead>
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
        <DialogTrigger />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPaint ? 'Edit Paint' : 'Create Paint'}</DialogTitle>
            <DialogDescription>
              {editingPaint
                ? 'Update paint details here.'
                : 'Enter new paint details here.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={editingPaint?.name || ''}
              onChange={(e) =>
                setEditingPaint({ ...editingPaint, name: e.target.value } as Paint)
              }
              placeholder="Paint name"
            />
            <Input
              value={editingPaint?.coverage_per_litre || ''}
              onChange={(e) =>
                setEditingPaint({ ...editingPaint, coverage_per_litre: parseFloat(e.target.value) } as Paint)
              }
              placeholder="Coverage per litre"
              type="number"
            />
            <Select
              value={editingPaint?.brandId?.toString() || ''}
              onValueChange={(value) =>
                setEditingPaint({ ...editingPaint, brandId: parseInt(value) } as Paint)
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
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingPaint) {
                  updatePaint(editingPaint);
                } else {
                  createPaint({} as Paint);
                }
              }}
            >
              {editingPaint ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
