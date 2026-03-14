import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';

// GET /api/admin/profile - Get admin profile
export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookie();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminData = await prisma.adminUser.findUnique({
      where: { admin_id: admin.id },
      select: {
        admin_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });

    if (!adminData) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: adminData.admin_id,
        username: adminData.username,
        email: adminData.email,
        role: adminData.role,
        created_at: adminData.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/profile - Update admin profile
export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookie();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, email } = body;

    // Check if email is already taken by another admin
    if (email && email !== admin.email) {
      const existingAdmin = await prisma.adminUser.findFirst({
        where: {
          email,
          admin_id: { not: admin.id },
        },
      });

      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // Update admin profile
    const updatedAdmin = await prisma.adminUser.update({
      where: { admin_id: admin.id },
      data: {
        username: username || admin.username,
        email: email || admin.email,
      },
      select: {
        admin_id: true,
        username: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.admin_id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
      },
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
