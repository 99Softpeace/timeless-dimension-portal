import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Women's Watches"
      description="Curated watches selected for women who value confidence, detail, and standout style."
      emptyMessage="No women's watches are available at the moment."
      category="Watches"
      gender="women"
      heroImage="/assets/images/gender/watches-women.jpg"
    />
  )
}
