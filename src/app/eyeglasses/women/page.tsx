import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Women's Eyeglasses"
      description="Curated eyeglasses selected for women who value confidence, detail, and standout style."
      emptyMessage="No women's eyeglasses are available at the moment."
      category="Eyeglasses"
      gender="women"
      heroImage="/assets/images/gender/eyeglasses-women.jpg"
    />
  )
}
