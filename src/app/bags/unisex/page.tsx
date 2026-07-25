import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Unisex Bags"
      description="Versatile bags selected for everyone, with effortless style and everyday appeal."
      emptyMessage="No unisex bags are available at the moment."
      category="Bags"
      gender="unisex"
      heroImage="/assets/images/gender/bags-unisex.jpg"
    />
  )
}
