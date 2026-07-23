import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Women's Bags"
      description="Elegant bags and carry pieces selected for women, everyday polish, and standout occasions."
      emptyMessage="No women's bags are available at the moment."
      category="Bags"
      gender="women"
      heroImage="/assets/images/editorial/model5.jpg"
    />
  )
}
