import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Men's Belts"
      description="Curated belts selected for modern men, everyday confidence, and polished style."
      emptyMessage="No men's belts are available at the moment."
      category="Belts"
      gender="men"
      heroImage="/assets/images/editorial/model6.jpg"
    />
  )
}
