'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react'

// --- Mock Data ---
const allProducts = [
  {
    id: '1',
    name: 'Heritage Classic',
    slug: 'heritage-classic',
    price: 250000,
    image: '/assets/images/heritage-classic.svg',
    model3d: '/assets/models/heritage-classic.glb',
    description: 'A timeless piece that embodies classic elegance',
    isNew: true,
    category: 'classic',
    brand: 'Timeless',
  },
  {
    id: '2',
    name: 'Nigerian Pride',
    slug: 'nigerian-pride',
    price: 180000,
    image: '/assets/images/nigerian-pride.svg',
    model3d: '/assets/models/nigerian-pride.glb',
    description: 'Celebrating Nigerian heritage with modern craftsmanship',
    isBestSeller: true,
    category: 'heritage',
    brand: 'Timeless',
  },
  {
    id: '3',
    name: 'Lagos Nights',
    slug: 'lagos-nights',
    price: 320000,
    image: '/assets/images/lagos-nights.svg',
    model3d: '/assets/models/lagos-nights.glb',
    description: 'Inspired by the vibrant energy of Lagos',
    discount: 15,
    category: 'modern',
    brand: 'Timeless',
  },
  {
    id: '4',
    name: 'Golden Hour',
    slug: 'golden-hour',
    price: 280000,
    image: '/assets/images/golden-hour.svg',
    model3d: '/assets/models/golden-hour.glb',
    description: 'Capturing the magic of golden hour in Nigeria',
    category: 'luxury',
    brand: 'Timeless',
  },
  {
    id: '5',
    name: 'Abuja Elegance',
    slug: 'abuja-elegance',
    price: 220000,
    image: '/assets/images/abuja-elegance.svg',
    model3d: '/assets/models/abuja-elegance.glb',
    description: "Sophisticated design inspired by Nigeria's capital",
    category: 'classic',
    brand: 'Timeless',
  },
  {
    id: '6',
    name: 'Kano Heritage',
    slug: 'kano-heritage',
    price: 195000,
    image: '/assets/images/kano-heritage.svg',
    model3d: '/assets/models/kano-heritage.glb',
    description: 'Honoring the rich history of Kano',
    category: 'heritage',
    brand: 'Timeless',
  },
  {
    id: '7',
    name: 'Port Harcourt Pearl',
    slug: 'port-harcourt-pearl',
    price: 350000,
    image: '/assets/images/port-harcourt-pearl.svg',
    model3d: '/assets/models/port-harcourt-pearl.glb',
    description: 'Luxury timepiece inspired by the oil city',
    category: 'luxury',
    brand: 'Timeless',
  },
  {
    id: '8',
    name: 'Calabar Coast',
    slug: 'calabar-coast',
    price: 240000,
    image: '/assets/images/calabar-coast.svg',
    model3d: '/assets/models/calabar-coast.glb',
    description: 'Elegant design reflecting coastal beauty',
    category: 'modern',
    brand: 'Timeless',
  },
]

const categories = [
  { id: 'all', name: 'All Watches', count: allProducts.length },
  { id: 'classic', name: 'Classic', count: allProducts.filter(p => p.category === 'classic').length },
  { id: 'heritage', name: 'Heritage', count: allProducts.filter(p => p.category === 'heritage').length },
  { id: 'modern', name: 'Modern', count: allProducts.filter(p => p.category === 'modern').length },
  { id: 'luxury', name: 'Luxury', count: allProducts.filter(p => p.category === 'luxury').length },
]

const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-200k', label: 'Under ₦200,000', min: 0, max: 200000 },
  { id: '200k-300k', label: '₦200,000 - ₦300,000', min: 200000, max: 300000 },
  { id: 'over-300k', label: 'Over ₦300,000', min: 300000, max: Infinity },
]

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      const priceRange = priceRanges.find(range => range.id === selectedPriceRange)
      const matchesPrice = product.price >= priceRange!.min && product.price <= priceRange!.max
      return matchesSearch && matchesCategory && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
        default:
          return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
      }
    })

  return (
    <motion.div
      className="pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-display font-bold text-silver mb-4">
            Shop Watches
          </h1>
          <p className="text-silver-dark text-lg">
            Discover our complete collection of luxury timepieces
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters with animation */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                key="filters"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:w-64 glass-card space-y-6 lg:block"
              >
                {/* Search */}
                <div>
                  <h3 className="text-lg font-semibold text-silver mb-3">Search</h3>
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-dark" />
                    <input
                      type="text"
                      placeholder="Search watches..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-midnight-3 border border-glass-border rounded-lg text-silver placeholder-silver-dark focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-silver mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-teal text-midnight'
                            : 'text-silver-dark hover:text-silver hover:bg-midnight-3'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <span className="text-sm">({category.count})</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="text-lg font-semibold text-silver mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedPriceRange === range.id
                            ? 'bg-teal text-midnight'
                            : 'text-silver-dark hover:text-silver hover:bg-midnight-3'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 glass rounded-lg text-silver hover:text-teal transition-colors"
                >
                  <SlidersHorizontal size={16} />
                  <span>Filters</span>
                </button>
                <span className="text-silver-dark text-sm">
                  {filteredProducts.length} products found
                </span>
              </div>

              {/* Sort + View */}
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-midnight-3 border border-glass-border rounded-lg text-silver focus:outline-none focus:border-teal"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>

                <div className="flex glass rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-teal text-midnight'
                        : 'text-silver-dark hover:text-silver'
                    }`}
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-teal text-midnight'
                        : 'text-silver-dark hover:text-silver'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <motion.div
              layout
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* No Results */}
            <AnimatePresence>
              {filteredProducts.length === 0 && (
                <motion.div
                  key="no-results"
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-silver mb-2">
                    No watches found
                  </h3>
                  <p className="text-silver-dark mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setSelectedPriceRange('all')
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
