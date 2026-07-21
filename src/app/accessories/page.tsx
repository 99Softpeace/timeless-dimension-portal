import ProductListingPage from '@/components/ProductListingPage'

export default function AccessoriesPage() {
  return (
    <ProductListingPage
      title="Bags, Clothes & Accessories"
      description="Explore bags, clothes, belts, eyeglasses, jewelry, and finishing touches for your wardrobe."
      emptyMessage="No accessories or fashion pieces are available at the moment."
      filter="accessories"
    />
  )
}
