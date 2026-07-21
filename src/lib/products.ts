export interface Product {
    id: string
    name: string
    slug: string
    price: number
    image: string
    model3d: string
    description: string
    isNew?: boolean
    isBestSeller?: boolean
    discount?: number
    category: string
    brand: string
    specs: {
        movement: string
        caseSize: string
        waterResistance: string
        strapMaterial: string
    }
}

export const allProducts: Product[] = []
