import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function exportDatabase() {
  try {
    console.log('Starting database export...\n');

    // Create exports directory
    const exportDir = path.join(process.cwd(), 'database_exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportPath = path.join(exportDir, `export_${timestamp}`);
    fs.mkdirSync(exportPath, { recursive: true });

    // Export all tables
    const tables = {
      users: await prisma.user.findMany(),
      adminUsers: await prisma.adminUser.findMany(),
      categories: await prisma.category.findMany(),
      products: await prisma.product.findMany(),
      cartItems: await prisma.cartItem.findMany(),
      paymentOrders: await prisma.paymentOrder.findMany(),
      orderItems: await prisma.orderItem.findMany(),
      promoCodes: await prisma.promoCode.findMany(),
      reviews: await prisma.review.findMany(),
      contacts: await prisma.contact.findMany(),
    };

    // Write each table to a separate JSON file
    for (const [tableName, data] of Object.entries(tables)) {
      const filePath = path.join(exportPath, `${tableName}.json`);
      fs.writeFileSync(
        filePath,
        JSON.stringify(data, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        , 2)
      );
      console.log(`✓ Exported ${tableName}: ${data.length} records`);
    }

    // Create a combined export file
    const combinedPath = path.join(exportPath, 'complete_database.json');
    fs.writeFileSync(
      combinedPath,
      JSON.stringify(tables, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      , 2)
    );
    console.log(`\n✓ Created combined export: complete_database.json`);

    // Create a summary file
    const summary = {
      exportDate: new Date().toISOString(),
      tables: Object.entries(tables).map(([name, data]) => ({
        tableName: name,
        recordCount: data.length,
      })),
      totalRecords: Object.values(tables).reduce((sum, data) => sum + data.length, 0),
    };

    const summaryPath = path.join(exportPath, 'export_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`✓ Created export summary\n`);

    console.log(`\nExport completed successfully!`);
    console.log(`Location: ${exportPath}`);
    console.log(`Total records exported: ${summary.totalRecords}\n`);

  } catch (error) {
    console.error('Error exporting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportDatabase();
