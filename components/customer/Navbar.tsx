'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/stores/cart-store';
import { ShoppingCart, User, Menu, Search, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  // Only show cart count after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 backdrop-blur-custom">
      <div className="container-custom">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="EasyBuyStore" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-text-primary hover:text-accent transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-text-primary hover:text-accent transition-colors font-medium">
              Products
            </Link>
            <Link href="/categories" className="text-text-primary hover:text-accent transition-colors font-medium">
              Categories
            </Link>
            <Link href="/about" className="text-text-primary hover:text-accent transition-colors font-medium">
              About
            </Link>
            <Link href="/contact" className="text-text-primary hover:text-accent transition-colors font-medium">
              Contact
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button className="text-text-primary hover:text-accent transition-colors p-2">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            {session && (
              <Link href="/account/wishlist" className="text-text-primary hover:text-red-500 transition-colors p-2" title="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative text-text-primary hover:text-accent transition-colors p-2">
              <ShoppingCart className="w-5 h-5" />
              {mounted && cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-text-primary hover:text-accent transition-colors p-2"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">{session.user.name}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-border py-2 z-50 animate-fade-in">
                    {session.user.role === 'admin' ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
                        >
                          Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
                        >
                          Wishlist
                        </Link>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut();
                          }}
                          className="block w-full text-left px-4 py-2 text-text-primary hover:bg-surface hover:text-accent transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="btn-accent text-sm"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text-primary hover:text-accent transition-colors p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border animate-fade-in">
            <Link href="/" className="block text-text-primary hover:text-accent transition-colors py-2 font-medium">
              Home
            </Link>
            <Link href="/products" className="block text-text-primary hover:text-accent transition-colors py-2 font-medium">
              Products
            </Link>
            <Link href="/categories" className="block text-text-primary hover:text-accent transition-colors py-2 font-medium">
              Categories
            </Link>
            <Link href="/about" className="block text-text-primary hover:text-accent transition-colors py-2 font-medium">
              About
            </Link>
            <Link href="/contact" className="block text-text-primary hover:text-accent transition-colors py-2 font-medium">
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
