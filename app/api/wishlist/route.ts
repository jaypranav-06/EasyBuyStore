/**
 * WISHLIST API ENDPOINTS
 *
 * Purpose: Allows users to save products for later purchase (wishlist functionality)
 * Implemented by: [Your Name]
 * Date: March 9, 2026
 *
 * Features:
 * - GET: Fetch all wishlist items for logged-in user
 * - POST: Add a product to user's wishlist
 *
 * Database: Uses CartItem table with item_type='wishlist' to distinguish from cart items
 * Authentication: Requires user to be logged in (NextAuth session)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/wishlist
 *
 * Fetches all wishlist items for the currently logged-in user
 *
 * Returns:
 * - List of wishlist items with product details
 * - Average ratings calculated from approved reviews
 * - Items sorted by creation date (newest first)
 *
 * Security:
 * - Requires authentication (401 if not logged in)
 * - Users can only see their own wishlist items
 */
export async function GET(request: NextRequest) {
  try {
    // Step 1: Verify user is authenticated using NextAuth session
    const session = await auth();

    // Return 401 Unauthorized if no valid session
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Query database for wishlist items
    // Filter by user_id and item_type='wishlist' to get only wishlist items (not cart)
    const wishlistItems = await prisma.cartItem.findMany({
      where: {
        user_id: parseInt(session.user.id),
        item_type: 'wishlist', // This distinguishes wishlist from cart items
      },
      include: {
        product: {
          include: {
            category: true,
            reviews: {
              where: { is_approved: true }, // Only include approved reviews
              select: { rating: true },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc', // Newest items first
      },
    });

    // Step 3: Calculate average rating for each product
    // This provides better UX by showing product ratings in wishlist
    const wishlistWithRating = wishlistItems.map((item) => {
      const reviews = item.product?.reviews || [];
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      // Convert Prisma Decimal types to Numbers for JSON serialization
      return {
        ...item,
        product: item.product ? {
          ...item.product,
          price: Number(item.product.price),
          discount_price: item.product.discount_price ? Number(item.product.discount_price) : null,
          avgRating,
          reviewCount: reviews.length,
        } : null,
      };
    });

    // Step 4: Return success response with wishlist data
    return NextResponse.json({
      success: true,
      items: wishlistWithRating,
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/wishlist
 *
 * Adds a product to the user's wishlist
 *
 * Request Body:
 * {
 *   "product_id": number  // The ID of the product to add
 * }
 *
 * Validation:
 * - Product must exist and be active
 * - Product cannot already be in wishlist (409 Conflict if duplicate)
 * - User must be authenticated
 *
 * Returns:
 * - 201: Successfully added to wishlist
 * - 400: Missing product_id
 * - 401: Not authenticated
 * - 404: Product not found
 * - 409: Product already in wishlist
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify user authentication
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Step 2: Parse and validate request body
    const body = await request.json();
    const { product_id } = body;

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const userId = parseInt(session.user.id);
    const productId = parseInt(product_id);

    // Step 3: Verify product exists and is active
    // This prevents adding deleted or inactive products to wishlist
    const product = await prisma.product.findFirst({
      where: {
        product_id: productId,
        is_active: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found or not available' },
        { status: 404 }
      );
    }

    // Step 4: Check for duplicate wishlist entry
    // Prevents same product from being added multiple times
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
        item_type: 'wishlist',
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 409 } // 409 Conflict - resource already exists
      );
    }

    // Step 5: Create new wishlist entry in database
    const wishlistItem = await prisma.cartItem.create({
      data: {
        user_id: userId,
        product_id: productId,
        quantity: 1, // Wishlist items always have quantity 1 (not for purchase yet)
        item_type: 'wishlist', // Key field that distinguishes from cart items
      },
    });

    // Fetch product details separately
    const productDetails = await prisma.product.findUnique({
      where: { product_id: productId },
      include: { category: true },
    });

    // Step 6: Return success response with created item
    return NextResponse.json({
      success: true,
      message: 'Product added to wishlist',
      item: {
        ...wishlistItem,
        product: productDetails ? {
          ...productDetails,
          price: Number(productDetails.price),
          discount_price: productDetails.discount_price
            ? Number(productDetails.discount_price)
            : null,
        } : null,
      },
    }, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}
