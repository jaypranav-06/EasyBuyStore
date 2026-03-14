import { NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        category_name: 'asc',
      },
      select: {
        category_id: true,
        category_name: true,
        description: true,
      },
    });

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
