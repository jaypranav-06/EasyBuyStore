import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth/admin';
import prisma from '@/lib/db/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const admin = await getAdminFromCookie();

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await params;
    const id = orderId;
    const body = await request.json();
    const { order_status, payment_status } = body;

    const order = await prisma.paymentOrder.update({
      where: { order_id: parseInt(id) },
      data: {
        order_status,
        payment_status,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
