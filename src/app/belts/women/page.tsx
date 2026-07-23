import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Women's Belts"
      description="Curated belts selected for women who value confidence, detail, and standout style."
      emptyMessage="No women's belts are available at the moment."
      category="Belts"
      gender="women"
      heroImage="/assets/images/gender/belts-women.jpg"
    />
  )
}
