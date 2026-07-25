import ProductListingPage from '@/components/ProductListingPage'

export default function Page() {
  return (
    <ProductListingPage
      title="Unisex Shoes"
      description="Versatile shoes selected for everyone, with effortless style and everyday appeal."
      emptyMessage="No unisex shoes are available at the moment."
      category="Shoes"
      gender="unisex"
      heroImage="/assets/images/gender/shoes-unisex.jpg"
    />
  )
}
