"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Container, Paint } from '@/app/types/paint'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AdminContainersPage() {
  const router = useRouter()
  const [containers, setContainers] = useState<Container[]>([])
  const [editingContainer, setEditingContainer] = useState<Container>({
    containerId: 0,
    size: 0,
    price: 0,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [paints, setPaints] = useState<Paint[]>([])

  useEffect(() => {
    fetchContainers()
    fetchPaints()
  }, [])

  async function fetchContainers() {
    try {
      const res = await fetch('/api/admin/containers')
      const data = await res.json()
      setContainers(data)
    } catch (error) {
      console.error('Failed to fetch containers:', error)
    }
  }

  async function fetchPaints() {
    try {
      const res = await fetch('/api/admin/paints')
      const data = await res.json()
      setPaints(data)
    } catch (error) {
      console.error('Failed to fetch paints:', error)
    }
  }

  async function createContainer(container: Container) {
    try {
      await fetch('/api/admin/containers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(container),
      })
      fetchContainers()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to create container:', error)
    }
  }

  async function updateContainer(container: Container) {
    try {
      await fetch(`/api/admin/containers/${container.containerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(container),
      })
      fetchContainers()
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update container:', error)
    }
  }

  async function deleteContainer(containerId: number) {
    try {
      await fetch(`/api/admin/containers/${containerId}`, { method: 'DELETE' })
      fetchContainers()
    } catch (error) {
      console.error('Failed to delete container:', error)
    }
  }

  return (
    <div className="container mx-auto mt-28 mb-8">
      <div className="flex space-x-6">
        <h1 className="text-4xl font-bold mb-8">Admin Containers</h1>
        <Button onClick={() => router.push("/admin")}>Back</Button>
        <Button onClick={() => {
          setEditingContainer({
            containerId: 0,
            size: 0,
            price: 0,
          })
          setIsOpen(true)
        }}>
          Create Container
        </Button>
      </div>
      <Table className="border rounded-md">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Paint</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {containers.map((container) => (
            <TableRow key={container.containerId}>
              <TableCell>{container.containerId}</TableCell>
              <TableCell>{container.size} L</TableCell>
              <TableCell>${container.price}</TableCell>
              <TableCell>{container.paintName}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingContainer(container)
                    setIsOpen(true)
                  }}
                >
                  Edit
                </Button>{' '}
                <Button
                  variant="outline"
                  onClick={() => deleteContainer(container.containerId)}
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
            <DialogTitle>{editingContainer.containerId ? 'Edit Container' : 'Create Container'}</DialogTitle>
            <DialogDescription>
              {editingContainer.containerId
                ? 'Update container details here.'
                : 'Enter new container details here.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Container Size (litres)</label>
              <Input
                value={editingContainer.size.toString()}
                onChange={(e) =>
                  setEditingContainer({ ...editingContainer, size: parseFloat(e.target.value) })
                }
                placeholder="Container size"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Container Price ($)</label>
              <Input
                value={editingContainer.price.toString()}
                onChange={(e) =>
                  setEditingContainer({ ...editingContainer, price: parseFloat(e.target.value) })
                }
                placeholder="Container price"
                type="number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Paint</label>
              <Select
                value={editingContainer.paintId?.toString()}
                onValueChange={(value) =>
                  setEditingContainer({ ...editingContainer, paintId: parseInt(value) })
                }
              >
                <SelectTrigger className="border rounded p-2">
                  <SelectValue placeholder="Select Paint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Paints</SelectLabel>
                    {paints.map((paint) => (
                      <SelectItem key={paint.paintId} value={paint.paintId.toString()}>
                        {paint.name}
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
                if (editingContainer.containerId) {
                  updateContainer(editingContainer);
                } else {
                  createContainer(editingContainer);
                }
              }}
            >
              {editingContainer.containerId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
