import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Unisex Watches"
      description="Versatile watches selected for everyone, with effortless style and everyday appeal."
      emptyMessage="No unisex watches are available at the moment."
      category="Watches"
      gender="unisex"
      heroImage="/assets/images/gender/watches-unisex.jpg"
    />
  )
}
