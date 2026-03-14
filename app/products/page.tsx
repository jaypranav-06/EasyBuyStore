'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Search, Filter } from 'lucide-react';
import AddToWishlistButton from '@/components/customer/AddToWishlistButton';

interface Product {
  product_id: number;
  product_name: string;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  category: { category_name: string } | null;
  average_rating: number;
  review_count: number;
  is_new: boolean;
}

interface Category {
  category_id: number;
  category_name: string;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showBestsellers, setShowBestsellers] = useState(false);

  // Read category from URL query parameter on initial load
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy, searchQuery, showFeatured, showNewArrivals, showBestsellers]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (showFeatured) params.append('featured', 'true');
      if (showNewArrivals) params.append('new', 'true');
      if (showBestsellers) params.append('bestseller', 'true');

      const apiUrl = `/api/products?${params}`;

      const response = await fetch(apiUrl, {
        cache: 'no-store',  // Disable Next.js fetch caching
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      const data = await response.json();

      if (data.success) {
        let sorted = data.products;

        // Sort products
        if (sortBy === 'price-low') {
          sorted = sorted.sort((a: Product, b: Product) =>
            (a.discount_price || a.price) - (b.discount_price || b.price)
          );
        } else if (sortBy === 'price-high') {
          sorted = sorted.sort((a: Product, b: Product) =>
            (b.discount_price || b.price) - (a.discount_price || a.price)
          );
        }

        setProducts(sorted);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Categories
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.category_id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === String(category.category_id)}
                        onChange={() => setSelectedCategory(String(category.category_id))}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-accent"
                      />
                      <span className="text-sm text-gray-700">{category.category_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Types
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showFeatured}
                      onChange={(e) => setShowFeatured(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showNewArrivals}
                      onChange={(e) => setShowNewArrivals(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">New Arrivals</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showBestsellers}
                      onChange={(e) => setShowBestsellers(e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-accent"
                    />
                    <span className="text-sm text-gray-700">Bestsellers</span>
                  </label>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchQuery('');
                  setSortBy('newest');
                  setShowFeatured(false);
                  setShowNewArrivals(false);
                  setShowBestsellers(false);
                }}
                className="w-full text-primary hover:text-primary-light text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;

  return (
    <div className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
        <Link href={`/products/${product.product_id}`} className="block">
          <div className="relative aspect-square">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.product_name}
                fill
                className="object-cover group-hover:scale-105 transition duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
            )}
            {product.is_new && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                New
              </span>
            )}
            {product.discount_price && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Sale
              </span>
            )}
          </div>
        </Link>
        <div className="p-4">
          <Link href={`/products/${product.product_id}`} className="block">
            <p className="text-sm text-gray-500 mb-1">{product.category?.category_name}</p>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1">
                {product.product_name}
              </h3>
              <div onClick={(e) => e.preventDefault()} className="flex-shrink-0 -mt-1">
                <AddToWishlistButton
                  productId={product.product_id}
                  className="!p-0 hover:scale-110 transition-transform"
                />
              </div>
            </div>
          </Link>
          <Link href={`/products/${product.product_id}`} className="block">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < Math.round(product.average_rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.review_count})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-800">
                Rs {price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  Rs {originalPrice.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
