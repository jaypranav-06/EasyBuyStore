/**
 * PRODUCTS API ENDPOINT
 *
 * This API handles fetching products from the Supabase database.
 * URL: /api/products
 * Method: GET
 *
 * Key Concepts for VIVA:
 * - RESTful API: Standard way to create web services
 * - Query Parameters: Filter products (by category, search, featured, etc.)
 * - Pagination: Load products in chunks (not all at once)
 * - Database Joins: Fetch product with category and reviews in one query
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

/**
 * GET /api/products
 *
 * Fetch products with optional filters.
 *
 * Supported Query Parameters:
 * - category: Filter by category ID (e.g., ?category=1)
 * - featured: Show only featured products (?featured=true)
 * - new: Show only new arrivals (?new=true)
 * - bestseller: Show only bestsellers (?bestseller=true)
 * - search: Search in name, description, keywords, and category name
 * - limit: Number of products per page (?limit=20)
 * - page: Page number for pagination (?page=1)
 *
 * Example URLs:
 * - /api/products - Get all products
 * - /api/products?category=2 - Get products in category 2
 * - /api/products?search=shoes - Search for "shoes"
 * - /api/products?featured=true&limit=8 - Get 8 featured products
 */
export async function GET(request: NextRequest) {
  try {
    /**
     * EXTRACT QUERY PARAMETERS
     *
     * Query parameters come after "?" in URL
     * Example: /api/products?category=1&featured=true
     */
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category'); // Category filter
    const featured = searchParams.get('featured'); // Featured filter
    const newArrivals = searchParams.get('new'); // New arrivals filter
    const bestseller = searchParams.get('bestseller'); // Bestseller filter
    const search = searchParams.get('search'); // Search query
    const limit = searchParams.get('limit'); // Items per page
    const page = searchParams.get('page'); // Current page number

    /**
     * BUILD FILTER OBJECT
     *
     * Prisma uses a "where" object to filter database queries.
     * We start with base filters (active products with stock).
     */
    const where: any = {
      is_active: true, // Only show active products
      stock_quantity: { gt: 0 }, // Only show products in stock (greater than 0)
    };

    /**
     * ADD CATEGORY FILTER
     *
     * If user selects a category, only show products from that category.
     */
    if (category) {
      where.category_id = parseInt(category); // Convert string to number
    }

    /**
     * ADD PRODUCT TYPE FILTERS
     *
     * These work together with category (AND logic).
     * You can filter by category AND featured at the same time.
     */
    if (featured === 'true') {
      where.is_featured = true; // Show only featured products
    }

    if (newArrivals === 'true') {
      where.is_new = true; // Show only new arrivals
    }

    if (bestseller === 'true') {
      where.is_bestseller = true; // Show only bestsellers
    }

    /**
     * ADD SEARCH FILTER
     *
     * Search in multiple fields using OR logic.
     * If search term is "shoes", find products where:
     * - Product name contains "shoes" OR
     * - Description contains "shoes" OR
     * - Keywords contain "shoes" OR
     * - Category name contains "shoes"
     *
     * mode: 'insensitive' makes search case-insensitive (Shoes = shoes = SHOES)
     */
    if (search) {
      where.OR = [
        { product_name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { keywords: { contains: search, mode: 'insensitive' } },
        { category: { category_name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    /**
     * PAGINATION SETUP
     *
     * Instead of loading all products at once (slow), load them in chunks.
     *
     * Example: 100 products total, limit=20
     * - Page 1: Products 1-20 (skip 0, take 20)
     * - Page 2: Products 21-40 (skip 20, take 20)
     * - Page 3: Products 41-60 (skip 40, take 20)
     */
    const take = limit ? parseInt(limit) : undefined; // How many to fetch
    const skip = page && limit ? (parseInt(page) - 1) * parseInt(limit) : undefined; // How many to skip

    /**
     * FETCH PRODUCTS FROM DATABASE
     *
     * Use Promise.all to run two queries at once:
     * 1. Get the products
     * 2. Count total products (for pagination)
     *
     * Include related data:
     * - category: Product's category information
     * - reviews: All approved reviews (for rating calculation)
     */
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, // Apply all filters
        include: {
          category: true, // Join with categories table
          reviews: {
            where: { is_approved: true }, // Only approved reviews
            select: {
              rating: true, // We only need the rating number
            },
          },
        },
        take, // Limit number of results
        skip, // Skip for pagination
        orderBy: {
          created_at: 'desc', // Newest products first
        },
      }),
      prisma.product.count({ where }), // Count total matching products
    ]);

    /**
     * CALCULATE AVERAGE RATINGS
     *
     * For each product, calculate its average customer rating.
     * Example: If product has ratings [5, 4, 5], average = 4.67
     */
    const productsWithRating = products.map((product) => {
      // Sum all ratings
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);

      // Calculate average (total / count)
      const avgRating = product.reviews.length > 0 ? totalRating / product.reviews.length : 0;

      return {
        ...product,
        average_rating: avgRating, // Add calculated average
        review_count: product.reviews.length, // Add review count
        reviews: undefined, // Remove reviews array (we don't need it in response)
      };
    });

    /**
     * RETURN RESPONSE
     *
     * Send JSON response with:
     * - success: true/false
     * - products: Array of products
     * - total: Total number of products (for pagination)
     * - page: Current page number
     * - limit: Items per page
     */
    return NextResponse.json({
      success: true,
      products: productsWithRating,
      total,
      page: page ? parseInt(page) : 1,
      limit: take || total,
    });
  } catch (error) {
    // If anything goes wrong, log error and return 500 status
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 } // Internal Server Error
    );
  }
}
