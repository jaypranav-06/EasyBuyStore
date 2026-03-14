'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag } from 'lucide-react';
import AddToWishlistButton from '@/components/customer/AddToWishlistButton';

interface ProductCardProps {
  product: any;
}

export default function ProductCardClient({ product }: ProductCardProps) {
  const price = Number(product.discount_price || product.price);
  const originalPrice = product.discount_price ? Number(product.price) : null;
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group product-card">
      <div className="card overflow-hidden border border-border hover:border-accent/30 transition-all duration-300">
        <Link href={`/products/${product.product_id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-surface">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.product_name}
                fill
                className="object-cover product-card-image"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_new && (
                <span className="badge badge-new font-medium">
                  NEW
                </span>
              )}
              {product.is_featured && (
                <span className="badge badge-featured font-medium">
                  FEATURED
                </span>
              )}
            </div>

            {product.discount_price && (
              <span className="absolute top-3 right-3 badge badge-sale font-bold">
                -{discountPercentage}%
              </span>
            )}

            {/* Quick Add Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="btn-accent transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                Quick View
              </button>
            </div>
          </div>
        </Link>

        <div className="p-5 space-y-2">
          <Link href={`/products/${product.product_id}`} className="block">
            {product.category?.category_name && (
              <p className="text-xs text-text-secondary uppercase tracking-wider">
                {product.category.category_name}
              </p>
            )}

            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-primary group-hover:text-accent transition-colors duration-300 line-clamp-2 flex-1">
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
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i < 4 ? 'currentColor' : 'none'}
                    stroke={i < 4 ? 'currentColor' : 'currentColor'}
                  />
                ))}
              </div>
              <span className="text-xs text-text-secondary">(4.0)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xl font-bold text-primary">
                Rs {price.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {originalPrice && (
                <span className="text-sm text-text-secondary line-through">
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
