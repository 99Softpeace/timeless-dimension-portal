import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Unisex Belts"
      description="Versatile belts selected for everyone, with effortless style and everyday appeal."
      emptyMessage="No unisex belts are available at the moment."
      category="Belts"
      gender="unisex"
      heroImage="/assets/images/gender/belts-unisex.jpg"
    />
  )
}
