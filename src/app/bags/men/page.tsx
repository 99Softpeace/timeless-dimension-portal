import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Men's Bags"
      description="Structured bags and carry pieces selected for modern men, work, travel, and everyday movement."
      emptyMessage="No men's bags are available at the moment."
      category="Bags"
      gender="men"
      heroImage="/assets/images/gender/bags-men.jpg"
    />
  )
}
