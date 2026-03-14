'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart-store';

export default function AddToCartButton({ product, className = '' }: { product: any; className?: string }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      product_id: product.product_id,
      product_name: product.product_name,
      price: Number(product.price),
      discount_price: product.discount_price ? Number(product.discount_price) : undefined,
      quantity,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-gray-700">Quantity:</span>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-100 rounded-l-lg"
            disabled={quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-6 py-2 font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
            className="p-2 hover:bg-gray-100 rounded-r-lg"
            disabled={quantity >= product.stock_quantity}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={product.stock_quantity === 0 || added}
        className={`w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      >
        <ShoppingCart className="w-5 h-5" />
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
    </div>
  );
}
