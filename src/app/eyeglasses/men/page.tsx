import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Men's Eyeglasses"
      description="Curated eyeglasses selected for modern men, everyday confidence, and polished style."
      emptyMessage="No men's eyeglasses are available at the moment."
      category="Eyeglasses"
      gender="men"
      heroImage="/assets/images/editorial/model9.jpg"
    />
  )
}
