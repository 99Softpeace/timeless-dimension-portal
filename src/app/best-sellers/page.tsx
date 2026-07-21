import ProductListingPage from '@/components/ProductListingPage'

export default function BestSellersPage() {
  return (
    <ProductListingPage
      title="Best Sellers"
      description="Our most coveted timepieces, loved by our community."
      emptyMessage="No best sellers at the moment."
      filter="best-seller"
    />
  )
}
