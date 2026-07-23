import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Women's Clothes"
      description="Curated clothes selected for women who value confidence, detail, and standout style."
      emptyMessage="No women's clothes are available at the moment."
      category="Clothes"
      gender="women"
      heroImage="/assets/images/gender/clothes-women.jpg"
    />
  )
}
