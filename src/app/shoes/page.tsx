import ProductListingPage from '@/components/ProductListingPage'

export default function ShoesPage() {
  return (
    <ProductListingPage
      title="Shoes"
      description="Step into everyday comfort and standout style with our curated footwear collection."
      emptyMessage="No shoes are available at the moment."
      category="Shoes"
      heroImage="/assets/images/shoes-hero.jpg"
    />
  )
}
