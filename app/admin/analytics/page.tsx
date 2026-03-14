import prisma from '@/lib/db/prisma';
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar } from 'lucide-react';

async function getAnalytics() {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [thisMonthRevenue, lastMonthRevenue, thisMonthOrders, lastMonthOrders, topProducts] =
    await Promise.all([
      prisma.paymentOrder.aggregate({
        _sum: { total: true },
        where: {
          payment_status: 'paid',
          created_at: { gte: firstDayThisMonth },
        },
      }),
      prisma.paymentOrder.aggregate({
        _sum: { total: true },
        where: {
          payment_status: 'paid',
          created_at: {
            gte: firstDayLastMonth,
            lt: firstDayThisMonth,
          },
        },
      }),
      prisma.paymentOrder.count({
        where: { created_at: { gte: firstDayThisMonth } },
      }),
      prisma.paymentOrder.count({
        where: {
          created_at: {
            gte: firstDayLastMonth,
            lt: firstDayThisMonth,
          },
        },
      }),
      prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true },
        _count: { id: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

  // Fetch product details for top products
  const productIds = topProducts.map((p) => p.product_id);
  const products = await prisma.product.findMany({
    where: { product_id: { in: productIds } },
    select: { product_id: true, product_name: true, image_url: true, price: true },
  });

  const topProductsWithDetails = topProducts.map((item) => {
    const product = products.find((p) => p.product_id === item.product_id);
    return {
      ...item,
      product,
    };
  });

  return {
    thisMonthRevenue: thisMonthRevenue._sum.total || 0,
    lastMonthRevenue: lastMonthRevenue._sum.total || 0,
    thisMonthOrders,
    lastMonthOrders,
    topProducts: topProductsWithDetails,
  };
}

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  const revenueChange =
    Number(analytics.lastMonthRevenue) > 0
      ? ((Number(analytics.thisMonthRevenue) - Number(analytics.lastMonthRevenue)) /
          Number(analytics.lastMonthRevenue)) *
        100
      : 0;

  const ordersChange =
    analytics.lastMonthOrders > 0
      ? ((analytics.thisMonthOrders - analytics.lastMonthOrders) / analytics.lastMonthOrders) *
        100
      : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track your store performance and trends</p>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                revenueChange >= 0 ? 'text-success' : 'text-red-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {revenueChange >= 0 ? '+' : ''}
              {revenueChange.toFixed(1)}%
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Revenue This Month</p>
          <p className="text-3xl font-bold text-gray-900">
            Rs {Number(analytics.thisMonthRevenue).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last month: Rs {Number(analytics.lastMonthRevenue).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-semibold ${
                ordersChange >= 0 ? 'text-success' : 'text-red-600'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              {ordersChange >= 0 ? '+' : ''}
              {ordersChange.toFixed(1)}%
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Orders This Month</p>
          <p className="text-3xl font-bold text-gray-900">{analytics.thisMonthOrders}</p>
          <p className="text-sm text-gray-500 mt-2">Last month: {analytics.lastMonthOrders}</p>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
        {analytics.topProducts.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No sales data yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analytics.topProducts.map((item, index) => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">#{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.product?.product_name}</p>
                  <p className="text-sm text-gray-600">
                    {item._sum.quantity} units sold • {item._count.id} orders
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    Rs {(Number(item.product?.price || 0) * (item._sum.quantity || 0)).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-600">Total revenue</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Message */}
      <div className="mt-8 bg-surface border border-primary rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-primary mb-1">Analytics Dashboard</h3>
            <p className="text-primary text-sm">
              This page shows basic analytics for your store. More detailed analytics features
              including charts, date range filters, and customer insights can be added based on
              your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
