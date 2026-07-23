import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Men's Shoes"
      description="Curated shoes selected for modern men, everyday confidence, and polished style."
      emptyMessage="No men's shoes are available at the moment."
      category="Shoes"
      gender="men"
      heroImage="/assets/images/gender/shoes-men.jpg"
    />
  )
}
