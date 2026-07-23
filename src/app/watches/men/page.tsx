import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Men's Watches"
      description="Curated watches selected for modern men, everyday confidence, and polished style."
      emptyMessage="No men's watches are available at the moment."
      category="Watches"
      gender="men"
      heroImage="/assets/images/editorial/model3.jpg"
    />
  )
}
