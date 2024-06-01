export interface Container {
  containerId: number
  size: number
  price: number
}
  
export interface Paint {
  paintId: number
  name: string
  description: string
  coverage_per_litre: number
  brandId: number
  brandName: string
  url: string
  containers: Container[]
}

export interface Brand {
  brandId: number
  name: string
}
