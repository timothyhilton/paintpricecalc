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
}
