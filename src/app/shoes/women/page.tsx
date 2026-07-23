import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Women's Shoes"
      description="Curated shoes selected for women who value confidence, detail, and standout style."
      emptyMessage="No women's shoes are available at the moment."
      category="Shoes"
      gender="women"
      heroImage="/assets/images/gender/shoes-women.jpg"
    />
  )
}
