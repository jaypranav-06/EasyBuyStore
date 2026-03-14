import prisma from '@/lib/db/prisma';
import { Users, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

async function getCustomers() {
  const customers = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      orders: {
        select: {
          order_id: true,
          total: true,
          order_status: true,
        },
      },
    },
  });

  return customers;
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  const stats = {
    total: customers.length,
    withOrders: customers.filter((c) => c.orders.length > 0).length,
    newThisMonth: customers.filter(
      (c) =>
        new Date(c.created_at).getMonth() === new Date().getMonth() &&
        new Date(c.created_at).getFullYear() === new Date().getFullYear()
    ).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage and view customer information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Customers</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">With Orders</p>
            <ShoppingBag className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.withOrders}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">New This Month</p>
            <Users className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.newThisMonth}</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Location</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Orders</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total Spent</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const totalSpent = customer.orders.reduce(
                    (sum, order) => sum + Number(order.total),
                    0
                  );

                  return (
                    <tr key={customer.user_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-sm text-gray-600">ID: {customer.user_id}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Mail className="w-4 h-4 text-gray-500" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-gray-500" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {customer.address ? (
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                            <span>{customer.address}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">No address</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">
                            {customer.orders.length}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        Rs {totalSpent.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(customer.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
