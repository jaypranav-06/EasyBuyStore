'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AddToWishlistButtonProps {
  productId: number;
  isInWishlist?: boolean;
  onToggle?: () => void;
  className?: string;
  showText?: boolean;
}

export default function AddToWishlistButton({
  productId,
  isInWishlist = false,
  onToggle,
  className = '',
  showText = false,
}: AddToWishlistButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(isInWishlist);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (status === 'unauthenticated') {
      router.push('/signin?callbackUrl=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (status === 'loading' || loading) return;

    setLoading(true);

    try {
      if (inWishlist) {
        // Remove from wishlist - we need to find the item ID first
        const response = await fetch('/api/wishlist');
        const data = await response.json();

        if (data.success) {
          const item = data.items.find((i: any) => i.product_id === productId);
          if (item) {
            const deleteResponse = await fetch(`/api/wishlist/${item.id}`, {
              method: 'DELETE',
            });

            if (deleteResponse.ok) {
              setInWishlist(false);
              if (onToggle) onToggle();
            } else {
              const errorData = await deleteResponse.json();
              alert(errorData.error || 'Failed to remove from wishlist');
            }
          }
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product_id: productId }),
        });

        if (response.ok) {
          setInWishlist(true);
          if (onToggle) onToggle();
        } else {
          const data = await response.json();
          if (response.status === 409) {
            setInWishlist(true);
          } else {
            alert(data.error || 'Failed to add to wishlist');
          }
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center gap-2 transition ${
        inWishlist
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`}
      />
      {showText && (
        <span className="text-sm font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
}
