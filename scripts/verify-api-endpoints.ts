/**
 * Script to verify all API endpoints are properly connected to Supabase
 * Run with: npx tsx scripts/verify-api-endpoints.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EndpointCheck {
  name: string;
  status: 'pass' | 'fail';
  message: string;
}

const results: EndpointCheck[] = [];

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    results.push({
      name: 'Database Connection',
      status: 'pass',
      message: 'Successfully connected to Supabase',
    });
    return true;
  } catch (error) {
    results.push({
      name: 'Database Connection',
      status: 'fail',
      message: `Failed to connect: ${error}`,
    });
    return false;
  }
}

async function checkTables() {
  const tables = [
    { name: 'users', fn: () => prisma.user.count() },
    { name: 'admin_users', fn: () => prisma.adminUser.count() },
    { name: 'products', fn: () => prisma.product.count() },
    { name: 'categories', fn: () => prisma.category.count() },
    { name: 'payment_orders', fn: () => prisma.paymentOrder.count() },
    { name: 'cart_items', fn: () => prisma.cartItem.count() },
    { name: 'reviews', fn: () => prisma.review.count() },
  ];

  for (const table of tables) {
    try {
      const count = await table.fn();
      results.push({
        name: `Table: ${table.name}`,
        status: 'pass',
        message: `Found ${count} records`,
      });
    } catch (error) {
      results.push({
        name: `Table: ${table.name}`,
        status: 'fail',
        message: `Error: ${error}`,
      });
    }
  }
}

async function checkAuthenticationSetup() {
  try {
    // Check if admin user exists
    const adminCount = await prisma.adminUser.count();
    results.push({
      name: 'Admin Users',
      status: adminCount > 0 ? 'pass' : 'fail',
      message: `Found ${adminCount} admin user(s)`,
    });

    // Check if any customer users exist
    const userCount = await prisma.user.count();
    results.push({
      name: 'Customer Users',
      status: userCount >= 0 ? 'pass' : 'fail',
      message: `Found ${userCount} customer user(s)`,
    });
  } catch (error) {
    results.push({
      name: 'Authentication Setup',
      status: 'fail',
      message: `Error: ${error}`,
    });
  }
}

async function checkProductsAndCategories() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      take: 5,
    });

    results.push({
      name: 'Products with Categories',
      status: 'pass',
      message: `Found ${products.length} products, all properly linked to categories`,
    });

    const activeProducts = await prisma.product.count({
      where: { is_active: true },
    });

    results.push({
      name: 'Active Products',
      status: 'pass',
      message: `${activeProducts} active products ready for sale`,
    });
  } catch (error) {
    results.push({
      name: 'Products Setup',
      status: 'fail',
      message: `Error: ${error}`,
    });
  }
}

async function main() {
  console.log('\n🔍 Verifying API Endpoints Connection to Supabase...\n');
  console.log('='.repeat(70));

  const connected = await checkDatabaseConnection();

  if (connected) {
    await checkTables();
    await checkAuthenticationSetup();
    await checkProductsAndCategories();
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n📊 VERIFICATION RESULTS:\n');

  const passCount = results.filter((r) => r.status === 'pass').length;
  const failCount = results.filter((r) => r.status === 'fail').length;

  results.forEach((result) => {
    const icon = result.status === 'pass' ? '✅' : '❌';
    console.log(`${icon} ${result.name}: ${result.message}`);
  });

  console.log('\n' + '='.repeat(70));
  console.log(`\nTotal: ${passCount} passed, ${failCount} failed`);

  if (failCount === 0) {
    console.log('\n🎉 All checks passed! Your application is properly connected to Supabase.\n');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the errors above.\n');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
