'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Grid, List, Search, X } from 'lucide-react'
import type { StoreProduct } from '@/lib/product-data'

type ProductFilter = 'all' | 'new' | 'best-seller' | 'sale' | 'accessories'

const EMPTY_PRODUCTS: StoreProduct[] = []
const PRODUCTS_PER_PAGE = 6

type ProductListingPageProps = {
  title: string
  description: string
  emptyMessage: string
  filter?: ProductFilter
  category?: string
  products?: StoreProduct[]
  heroImage?: string
  gender?: 'men' | 'women' | 'unisex'
}

const categoryThemes: Record<string, { eyebrow: string; accent: string; bg: string; text: string; imagePosition: string }> = {
  watches: {
    eyebrow: 'Signature Wristwear',
    accent: 'from-amber-300/35 via-white/10 to-transparent',
    bg: 'bg-[#15120d]',
    text: 'text-amber-50',
    imagePosition: 'object-center',
  },
  bags: {
    eyebrow: 'Structured Carry Pieces',
    accent: 'from-rose-300/35 via-white/10 to-transparent',
    bg: 'bg-[#1b0f12]',
    text: 'text-rose-50',
    imagePosition: 'object-center',
  },
  clothes: {
    eyebrow: 'Wardrobe Essentials',
    accent: 'from-emerald-300/35 via-white/10 to-transparent',
    bg: 'bg-[#101713]',
    text: 'text-emerald-50',
    imagePosition: 'object-center',
  },
  belts: {
    eyebrow: 'Sharp Leather Details',
    accent: 'from-yellow-300/35 via-white/10 to-transparent',
    bg: 'bg-[#18120b]',
    text: 'text-yellow-50',
    imagePosition: 'object-center',
  },
  eyeglasses: {
    eyebrow: 'Frames With Presence',
    accent: 'from-orange-300/35 via-white/10 to-transparent',
    bg: 'bg-[#17110e]',
    text: 'text-orange-50',
    imagePosition: 'object-center',
  },
  shoes: {
    eyebrow: 'Footwear With Character',
    accent: 'from-orange-300/40 via-amber-900/15 to-transparent',
    bg: 'bg-[#1d0c05]',
    text: 'text-orange-50',
    imagePosition: 'object-center',
  },
  default: {
    eyebrow: 'Curated Collection',
    accent: 'from-teal-300/30 via-white/10 to-transparent',
    bg: 'bg-slate-950',
    text: 'text-white',
    imagePosition: 'object-center',
  },
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function normalizeClientProduct(product: any): StoreProduct | null {
  if (!product) return null

  const slug = product.slug || toSlug(product.name || '')
  if (!slug) return null

  return {
    id: String(product.id || product._id || slug),
    slug,
    name: product.name || 'Untitled Product',
    price: Number(product.price || 0),
    image: product.image || product.images?.[0] || '/assets/images/heritage-classic-v2.png',
    category: String(product.category || 'Uncategorized'),
    gender: ['men', 'women', 'unisex'].includes(product.gender) ? product.gender : undefined,
    isNew: Boolean(product.isNew),
    isBestSeller: Boolean(product.isBestSeller),
    isFeatured: Boolean(product.isFeatured),
    discount: product.discount === undefined ? undefined : Number(product.discount),
  }
}

function categoryMatches(productCategory: string, targetCategory: string) {
  const category = productCategory.toLowerCase()
  const target = targetCategory.toLowerCase()
  if (target === 'watches') return category.includes('watch')
  if (target === 'bags') return category.includes('bag')
  if (target === 'clothes') return category.includes('cloth') || category.includes('wear') || category.includes('apparel')
  if (target === 'belts') return category.includes('belt')
  if (target === 'eyeglasses') return category.includes('eyeglass') || category.includes('glass') || category.includes('frame')
  if (target === 'shoes') return category.includes('shoe') || category.includes('footwear') || category.includes('sneaker')
  return category.includes(target)
}

function applyFilter(product: StoreProduct, filter?: ProductFilter, category?: string, gender?: 'men' | 'women' | 'unisex') {
  const productCategory = product.category.toLowerCase()
  if (category && !categoryMatches(productCategory, category)) return false
  if (gender && product.gender !== gender) return false
  if (filter === 'new') return product.isNew
  if (filter === 'best-seller') return product.isBestSeller
  if (filter === 'sale') return Number(product.discount || 0) > 0
  if (filter === 'accessories') return ['accessories', 'bags', 'clothes', 'belts', 'eyeglasses', 'jewelry'].some((item) => productCategory.includes(item.slice(0, -1)) || productCategory.includes(item))
  return true
}

function getTheme(title: string, category?: string) {
  const key = (category || title).toLowerCase()
  if (key.includes('watch')) return categoryThemes.watches
  if (key.includes('bag')) return categoryThemes.bags
  if (key.includes('cloth')) return categoryThemes.clothes
  if (key.includes('belt')) return categoryThemes.belts
  if (key.includes('eyeglass') || key.includes('glass')) return categoryThemes.eyeglasses
  if (key.includes('shoe') || key.includes('footwear') || key.includes('sneaker')) return categoryThemes.shoes
  return categoryThemes.default
}

export default function ProductListingPage({ title, description, emptyMessage, filter = 'all', category, products = EMPTY_PRODUCTS, heroImage, gender }: ProductListingPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [allProducts, setAllProducts] = useState<StoreProduct[]>(products)
  const [isLoading, setIsLoading] = useState(products.length === 0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc'>('newest')
  const theme = getTheme(title, category)

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      if (products.length > 0) {
        setAllProducts(products)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch('/api/products?limit=200', { cache: 'no-store' })
        const result = await response.json()
        if (!cancelled && Array.isArray(result.data)) {
          setAllProducts(result.data.map(normalizeClientProduct).filter(Boolean) as StoreProduct[])
        }
      } catch (error) {
        console.error('Error loading products:', error)
        if (!cancelled) setAllProducts([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadProducts()

    return () => {
      cancelled = true
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const matches = allProducts.filter((product) =>
      applyFilter(product, filter, category, gender) &&
      (!query || product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query))
    )

    return [...matches].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name)
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name)
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })
  }, [allProducts, category, filter, gender, searchQuery, sortBy])
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE))
  const visibleProducts = useMemo(
    () => filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE),
    [currentPage, filteredProducts]
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [category, filter, gender, searchQuery, sortBy])

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [currentPage, totalPages])

  function changePage(page: number) {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
    document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.main
      className="min-h-screen overflow-x-hidden bg-[#f6f2ec] pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <section className="px-3 pt-24 md:px-5 md:pt-28">
        <div className={`relative min-h-[520px] overflow-hidden rounded-[2rem] md:min-h-[620px] md:rounded-[3rem] ${theme.bg}`}>
          {heroImage && (
            <Image
              src={heroImage}
              alt={title}
              fill
              className={`object-cover ${theme.imagePosition}`}
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/45" />
          <div className={`absolute inset-0 bg-gradient-to-tr ${theme.accent}`} />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 md:min-h-[620px] md:p-10 lg:p-14">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur-md">
                {theme.eyebrow}
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-black">
                Senator Collection
              </span>
            </div>

            <div className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {category && (
                <div className="absolute left-10 top-28 hidden gap-2 md:flex lg:left-14">
                  <a href={`/${category.toLowerCase()}/men`} className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-bold backdrop-blur-md transition md:flex-none ${gender === 'men' ? 'bg-white text-black' : 'border border-white/30 bg-black/20 text-white hover:bg-white/20'}`}>Men</a>
                  <a href={`/${category.toLowerCase()}/women`} className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-bold backdrop-blur-md transition md:flex-none ${gender === 'women' ? 'bg-white text-black' : 'border border-white/30 bg-black/20 text-white hover:bg-white/20'}`}>Women</a>
                  <a href={`/${category.toLowerCase()}/unisex`} className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-bold backdrop-blur-md transition md:flex-none ${gender === 'unisex' ? 'bg-white text-black' : 'border border-white/30 bg-black/20 text-white hover:bg-white/20'}`}>Unisex</a>
                </div>
              )}
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`max-w-5xl text-[clamp(3rem,15vw,10rem)] sm:text-[clamp(4rem,12vw,10rem)] font-black leading-[0.82] tracking-[-0.07em] ${theme.text}`}
                >
                  {title}
                </motion.h1>

              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-2 gap-2 rounded-[1.5rem] border border-white/15 bg-white/10 p-2 text-white backdrop-blur-xl"
              >
                <div className="rounded-[1.2rem] bg-white/90 p-4 text-black">
                  <p className="text-3xl font-black leading-none">{isLoading ? '...' : filteredProducts.length}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/60">Available</p>
                </div>
                <div className="rounded-[1.2rem] bg-white/10 p-4">
                  <p className="text-3xl font-black leading-none">Fresh</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Curated Picks</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section id="product-grid" className="scroll-mt-24 px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-5 border-b border-black/10 pb-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-slate-500">Browse Products</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">Shop {title}</h2>
            </div>

            {category && (
              <nav className="flex w-full items-center gap-1 rounded-full border border-black/10 bg-white p-1 shadow-sm md:hidden" aria-label={`${category} audience`}>
                <a href={`/${category.toLowerCase()}/men`} className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold ${gender === 'men' ? 'bg-slate-950 text-white' : 'text-slate-500'}`}>Men</a>
                <a href={`/${category.toLowerCase()}/women`} className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold ${gender === 'women' ? 'bg-slate-950 text-white' : 'text-slate-500'}`}>Women</a>
                <a href={`/${category.toLowerCase()}/unisex`} className={`flex-1 rounded-full px-3 py-2.5 text-center text-sm font-semibold ${gender === 'unisex' ? 'bg-slate-950 text-white' : 'text-slate-500'}`}>Unisex</a>
              </nav>
            )}

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <label className="relative block w-full sm:w-72">
                <span className="sr-only">Search this collection</span>
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  inputMode="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={`Search ${title.toLowerCase()}`}
                  className="h-12 w-full rounded-full border border-black/10 bg-white pl-11 pr-11 text-sm font-medium text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-black/5"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                    <X size={16} />
                  </button>
                )}
              </label>

              <label className="relative block w-full sm:w-52">
                <span className="sr-only">Sort products</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                  className="h-12 w-full cursor-pointer appearance-none rounded-full border border-black/10 bg-white px-5 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-black/5"
                  aria-label="Sort products"
                >
                  <option value="newest">Newest first</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                  <option value="price-asc">Price: Low to high</option>
                  <option value="price-desc">Price: High to low</option>
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">▼</span>
              </label>

              <div className="flex w-fit rounded-full border border-black/10 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${viewMode === 'grid' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-950'}`}
                aria-label="Grid view"
              >
                <Grid size={18} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-slate-950 text-white' : 'text-slate-500 hover:text-slate-950'}`}
                aria-label="List view"
              >
                <List size={18} /> List
              </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-[2rem] bg-white p-6 shadow-sm">
                  <div className="aspect-square rounded-[1.5rem] bg-slate-200" />
                  <div className="mx-auto mt-6 h-4 w-2/3 rounded bg-slate-200" />
                  <div className="mx-auto mt-3 h-3 w-1/3 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.length > 0 ? (
                visibleProducts.map((product, index) => (
                  <div key={product.id} className="rounded-[2rem] bg-white p-4 shadow-sm shadow-black/5">
                    <ProductCard product={product} index={index} />
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-[2rem] border border-black/10 bg-white px-6 py-20 text-center shadow-sm">
                  {searchQuery.trim() ? (
                    <>
                      <p className="text-xl font-semibold text-slate-900">No matching products found</p>
                      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
                        We couldn’t find “{searchQuery.trim()}” in {title}. Try another product name or browse the full collection.
                      </p>
                      <button type="button" onClick={() => setSearchQuery('')} className="mt-6 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                        Clear search
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-xl font-semibold text-slate-900">This collection is coming soon</p>
                      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
                        We're curating something special for this collection. Please check back soon for new pieces.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {!isLoading && filteredProducts.length > PRODUCTS_PER_PAGE && (
            <nav className="mt-10 flex flex-col items-center gap-4" aria-label="Product pages">
              <p className="text-sm font-medium text-slate-500">
                Page {currentPage} of {totalPages} · {filteredProducts.length} products
              </p>
              <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-black/10 bg-white p-2 shadow-sm">
                <button type="button" onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="flex h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous product page">
                  <ChevronLeft size={18} /> <span className="hidden sm:inline">Previous</span>
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button key={page} type="button" onClick={() => changePage(page)} aria-current={page === currentPage ? 'page' : undefined} aria-label={`Go to product page ${page}`} className={`h-11 min-w-11 rounded-full px-3 text-sm font-bold transition ${page === currentPage ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                    {page}
                  </button>
                ))}
                <button type="button" onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="flex h-11 items-center gap-1 rounded-full px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next product page">
                  <span className="hidden sm:inline">Next</span> <ChevronRight size={18} />
                </button>
              </div>
            </nav>
          )}
        </div>
      </section>
    </motion.main>
  )
}
