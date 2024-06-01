"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Brand } from '@/app/types/paint'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

export default function AdminBrandsPage() {
  const router = useRouter()
  const [brands, setBrands] = useState<Brand[]>([])
  const [editingBrand, setEditingBrand] = useState<Brand>({
    brandId: 0,
    name: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    mobile: '',
    phone: '',
    website: ''
  })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    try {
      const res = await fetch('/api/admin/brands')
      const data = await res.json()
      setBrands(data)
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }

  async function createBrand(brand: Brand) {
    try {
      await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      })
      fetchBrands()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create brand:', error)
    }
  }

  async function updateBrand(brand: Brand) {
    try {
      await fetch(`/api/admin/brands/${brand.brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      })
      fetchBrands()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update brand:', error)
    }
  }

  async function deleteBrand(brandId: number) {
    try {
      await fetch(`/api/admin/brands/${brandId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      fetchBrands()
    } catch (error) {
      console.error('Failed to delete brand:', error)
    }
  }

  return (
    <div className="container mx-auto mt-28 mb-8">
      <div className="flex space-x-6">
        <h1 className="text-4xl font-bold mb-8">Admin Brands</h1>
        <Button onClick={() => router.push("/admin")}>Back</Button>
        <Button onClick={() => {
          setEditingBrand({
            brandId: 0,
            name: '',
            address: '',
            city: '',
            state: '',
            postcode: '',
            mobile: '',
            phone: '',
            website: ''
          })
          setIsOpen(true)
        }}>
          Create Brand
        </Button>
      </div>
      
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.brandId}>
              <TableCell>{brand.brandId}</TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingBrand(brand)
                    setIsOpen(true)
                  }}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="outline"
                  onClick={() => deleteBrand(brand.brandId)}
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
            <DialogTitle>{editingBrand.brandId ? 'Edit Brand' : 'Create Brand'}</DialogTitle>
            <DialogDescription>
              {editingBrand.brandId
                ? 'Update brand details here.'
                : 'Enter new brand details here.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Brand Name</label>
              <Input
                value={editingBrand.name}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, name: e.target.value })
                }
                placeholder="Brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Input
                value={editingBrand.address}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, address: e.target.value })
                }
                placeholder="Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <Input
                value={editingBrand.city}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, city: e.target.value })
                }
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <Input
                value={editingBrand.state}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, state: e.target.value })
                }
                placeholder="State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Postcode</label>
              <Input
                value={editingBrand.postcode}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, postcode: e.target.value })
                }
                placeholder="Postcode"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <Input
                value={editingBrand.mobile}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, mobile: e.target.value })
                }
                placeholder="Mobile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                value={editingBrand.phone}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, phone: e.target.value })
                }
                placeholder="Phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Website</label>
              <Input
                value={editingBrand.website}
                onChange={(e) =>
                  setEditingBrand({ ...editingBrand, website: e.target.value })
                }
                placeholder="Website"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (editingBrand.brandId) {
                  updateBrand(editingBrand);
                } else {
                  createBrand(editingBrand);
                }
              }}
            >
              {editingBrand.brandId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

