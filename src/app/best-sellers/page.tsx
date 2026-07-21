import ProductListingPage from '@/components/ProductListingPage'

export default function BestSellersPage() {
  return (
    <ProductListingPage
      title="Best Sellers"
      description="Our most requested fashion pieces, accessories, and statement essentials."
      emptyMessage="No best sellers at the moment."
      filter="best-seller"
    />
  )
}
