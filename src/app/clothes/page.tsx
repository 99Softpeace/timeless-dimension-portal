import ProductListingPage from '@/components/ProductListingPage'

export default function ClothesPage() {
  return (
    <ProductListingPage
      title="Clothes"
      description="Clean wardrobe pieces for work, occasions, and confident daily movement."
      emptyMessage="No clothes are available at the moment."
      category="Clothes"
      heroImage="/assets/images/editorial/model1.jpg"
    />
  )
}
