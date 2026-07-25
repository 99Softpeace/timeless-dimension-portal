import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Unisex Clothes"
      description="Versatile clothes selected for everyone, with effortless style and everyday appeal."
      emptyMessage="No unisex clothes are available at the moment."
      category="Clothes"
      gender="unisex"
      heroImage="/assets/images/gender/clothes-unisex.jpg"
    />
  )
}
