export interface Container {
  paintName?: string
  paintId?: number
  containerId: number
  size: number
  price: number
}
  
export interface Paint {
  paintId: number
  name: string
  coverage_per_litre: number
  brandId: number
  brandName: string
  containers: Container[]
  url: string
}

export interface Brand {
  brandId: number
  name: string
  address?: string
  city?: string
  state?: string
  postcode?: string
  mobile?: string
  phone?: string
  website?: string
}
