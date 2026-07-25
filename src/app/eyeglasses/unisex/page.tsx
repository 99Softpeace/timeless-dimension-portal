import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Unisex Eyeglasses"
      description="Versatile eyeglasses selected for everyone, with effortless style and everyday appeal."
      emptyMessage="No unisex eyeglasses are available at the moment."
      category="Eyeglasses"
      gender="unisex"
      heroImage="/assets/images/gender/eyeglasses-unisex.jpg"
    />
  )
}
