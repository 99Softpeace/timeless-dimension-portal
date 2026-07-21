import ProductListingPage from '@/components/ProductListingPage'

export default function AccessoriesPage() {
  return (
    <ProductListingPage
      title="Accessories"
      description="Explore straps, bracelets, and finishing touches for your collection."
      emptyMessage="No accessories are available at the moment."
      filter="accessories"
    />
  )
}
