export const dynamic = 'force-dynamic'

import CollectionsClient from './CollectionsClient'
import { getStoreProducts } from '@/lib/product-data'

export default async function CollectionsPage() {
  const products = await getStoreProducts()
  return <CollectionsClient products={products} />
}
