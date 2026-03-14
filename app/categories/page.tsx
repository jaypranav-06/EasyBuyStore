import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import prisma from '@/lib/db/prisma';

async function getCategories() {
  const categories = await prisma.category.findMany({
    where: { is_active: true },
    include: {
      _count: {
        select: {
          products: {
            where: {
              is_active: true,
              stock_quantity: { gt: 0 },
            },
          },
        },
      },
    },
    orderBy: { category_name: 'asc' },
  });

  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Shop by Category</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Explore our wide range of products organized by category
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No categories available</h2>
            <p className="text-gray-600">Check back later for new categories!</p>
          </div>
        ) : (
          <>
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Browse {categories.length} Categories
              </h2>
              <p className="text-gray-600">
                Find exactly what you're looking for by exploring our carefully organized product categories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.category_id}
                  href={`/products?category=${category.category_id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
                    {/* Category Image */}
                    <div className="relative h-48 bg-gradient-to-br from-primary to-accent overflow-hidden">
                      {category.image_url ? (
                        <Image
                          src={category.image_url}
                          alt={category.category_name}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ShoppingBag className="w-20 h-20 text-white opacity-80 group-hover:scale-110 transition" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>

                    {/* Category Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition">
                        {category.category_name}
                      </h3>

                      {category.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {category._count.products} {category._count.products === 1 ? 'product' : 'products'}
                        </span>
                        <span className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                          Shop Now
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Featured Categories */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Popular Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {categories.slice(0, 4).map((category) => (
                  <Link
                    key={`featured-${category.category_id}`}
                    href={`/products?category=${category.category_id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition p-6 flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.category_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <ShoppingBag className="w-10 h-10 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition">
                          {category.category_name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {category._count.products} products available
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-white">
              <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
              <p className="text-gray-100 mb-8 max-w-2xl mx-auto">
                Browse all our products or use the search feature to find exactly what you need.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-surface transition"
                >
                  View All Products
                </Link>
                <Link
                  href="/contact"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-light transition"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
