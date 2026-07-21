import ProductListingPage from '@/components/ProductListingPage'

export default function NewArrivalsPage() {
  return (
    <ProductListingPage
      title="New Arrivals"
      description="Discover the latest additions to our exclusive collection."
      emptyMessage="No new arrivals at the moment. Check back soon!"
      filter="new"
    />
  )
}
