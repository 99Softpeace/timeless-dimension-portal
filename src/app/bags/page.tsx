import ProductListingPage from '@/components/ProductListingPage'

export default function BagsPage() {
  return (
    <ProductListingPage
      title="Bags"
      description="Structured bags and carry pieces made to complete polished everyday looks."
      emptyMessage="No bags are available at the moment."
      category="Bags"
      heroImage="/assets/images/editorial/model5.jpg"
    />
  )
}
