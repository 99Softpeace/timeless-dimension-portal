import ProductListingPage from '@/components/ProductListingPage'

export default function SalePage() {
  return (
    <ProductListingPage
      title="Exclusive Sales"
      description="Limited time offers on selected bags, clothes, belts, eyeglasses, watches, and accessories."
      emptyMessage="No sale items active at the moment."
      filter="sale"
    />
  )
}
