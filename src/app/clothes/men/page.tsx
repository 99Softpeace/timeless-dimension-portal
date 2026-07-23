import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Men's Clothes"
      description="Curated clothes selected for modern men, everyday confidence, and polished style."
      emptyMessage="No men's clothes are available at the moment."
      category="Clothes"
      gender="men"
      heroImage="/assets/images/editorial/model1.jpg"
    />
  )
}
