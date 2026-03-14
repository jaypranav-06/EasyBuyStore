import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromCookie } from '@/lib/auth/admin';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'store-settings.json');

// Default settings
const DEFAULT_SETTINGS = {
  store_name: 'EasyBuyStore',
  store_email: 'contact@easybuystore.com',
  store_phone: '+1 (555) 123-4567',
  store_address: '123 Fashion Street, New York, NY 10001',
  tax_rate: 10,
  shipping_fee: 10,
  free_shipping_threshold: 50,
  currency: 'USD',
};

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// GET /api/admin/store-settings - Get store settings
export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookie();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    ensureDataDir();

    // Read settings file or return defaults
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const settings = JSON.parse(data);
      return NextResponse.json({ success: true, settings });
    } else {
      // Create file with defaults
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return NextResponse.json({ success: true, settings: DEFAULT_SETTINGS });
    }
  } catch (error) {
    console.error('Error reading store settings:', error);
    return NextResponse.json(
      { success: true, settings: DEFAULT_SETTINGS },
      { status: 200 }
    );
  }
}

// PUT /api/admin/store-settings - Update store settings
export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookie();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    if (!body.store_name || !body.store_email) {
      return NextResponse.json(
        { error: 'Store name and email are required' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (body.tax_rate < 0 || body.tax_rate > 100) {
      return NextResponse.json(
        { error: 'Tax rate must be between 0 and 100' },
        { status: 400 }
      );
    }

    ensureDataDir();

    // Save settings to file
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(body, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Store settings updated successfully',
      settings: body,
    });
  } catch (error) {
    console.error('Error updating store settings:', error);
    return NextResponse.json(
      { error: 'Failed to update store settings' },
      { status: 500 }
    );
  }
}
