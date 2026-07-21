import ProductListingPage from '@/components/ProductListingPage'

export default function WatchesPage() {
  return (
    <ProductListingPage
      title="Watches"
      description="Signature watches selected for presence, precision, and everyday style."
      emptyMessage="No watches are available at the moment."
      category="Watches"
      heroImage="/assets/images/editorial/model3.jpg"
    />
  )
}
