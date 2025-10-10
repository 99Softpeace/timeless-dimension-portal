import { notFound } from "next/navigation"
import ProductPageClient from "./ProductPageClient"

// Mock data (replace with API call later)
const products = {
  "heritage-classic": {
    id: "1",
    name: "Heritage Classic",
    slug: "heritage-classic",
    price: 250000,
    originalPrice: 300000,
    image: "/assets/images/heritage-classic.svg",
    model3d: "/assets/models/heritage-classic.glb",
    images: [
      "/assets/images/heritage-classic.svg",
      "/assets/images/heritage-classic-2.svg",
      "/assets/images/heritage-classic-3.svg",
    ],
    description: "A timeless piece that embodies classic elegance.",
    longDescription: "Long description here...",
    features: ["Swiss Automatic Movement", "42mm Stainless Steel Case"],
    specifications: {
      "Case Material": "Stainless Steel",
      "Case Size": "42mm",
    },
    rating: 4.8,
    reviews: 127,
    inStock: true,
    isNew: true,
    isBestSeller: false,
  },
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = products[params.slug as keyof typeof products]

  if (!product) return notFound()

  return <ProductPageClient product={product} />
}
