/**
 * PayPal REST API Integration
 * Reference: https://developer.paypal.com/api/rest/
 */

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'live';
  apiUrl: string;
}

/**
 * Get PayPal configuration from environment variables
 */
export function getPayPalConfig(): PayPalConfig {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE === 'live' ? 'live' : 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Please set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env');
  }

  const apiUrl = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  return {
    clientId,
    clientSecret,
    mode,
    apiUrl,
  };
}

/**
 * Get PayPal OAuth access token
 * Reference: https://developer.paypal.com/api/rest/authentication/
 */
export async function getPayPalAccessToken(): Promise<string> {
  const config = getPayPalConfig();

  const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

  const response = await fetch(`${config.apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal authentication failed: ${error.error_description || error.error}`);
  }

  const data = await response.json();
  return data.access_token;
}

export interface CreateOrderParams {
  amount: number;
  currency?: string;
  referenceId?: string;
  items?: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  returnUrl?: string;
  cancelUrl?: string;
}

/**
 * Create a PayPal order
 * Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export async function createPayPalOrder(params: CreateOrderParams) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const {
    amount,
    currency = 'USD',
    referenceId = 'default',
    items,
    returnUrl = `${process.env.NEXTAUTH_URL}/checkout/success`,
    cancelUrl = `${process.env.NEXTAUTH_URL}/checkout/cancel`,
  } = params;

  const requestBody: any = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: referenceId,
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      },
    ],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      brand_name: 'EasyBuyStore',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
    },
  };

  // Add items if provided
  if (items && items.length > 0) {
    requestBody.purchase_units[0].items = items.map(item => ({
      name: item.name,
      quantity: item.quantity.toString(),
      unit_amount: {
        currency_code: currency,
        value: item.unit_amount.toFixed(2),
      },
    }));

    // Add item breakdown
    requestBody.purchase_units[0].amount.breakdown = {
      item_total: {
        currency_code: currency,
        value: amount.toFixed(2),
      },
    };
  }

  const response = await fetch(`${config.apiUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal order creation failed: ${error.message || JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Capture a PayPal order
 * Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export async function capturePayPalOrder(orderId: string) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${config.apiUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`PayPal order capture failed: ${error.message || JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Get order details
 * Reference: https://developer.paypal.com/docs/api/orders/v2/#orders_get
 */
export async function getPayPalOrderDetails(orderId: string) {
  const config = getPayPalConfig();
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${config.apiUrl}/v2/checkout/orders/${orderId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get PayPal order details: ${error.message || JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Extract transaction details from capture response
 */
export function extractTransactionDetails(captureData: any) {
  const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    transactionId: capture?.id,
    status: capture?.status,
    amount: capture?.amount?.value,
    currency: capture?.amount?.currency_code,
    payer: {
      email: captureData.payer?.email_address,
      payerId: captureData.payer?.payer_id,
      name: {
        givenName: captureData.payer?.name?.given_name,
        surname: captureData.payer?.name?.surname,
        fullName: `${captureData.payer?.name?.given_name || ''} ${captureData.payer?.name?.surname || ''}`.trim(),
      },
    },
    createTime: capture?.create_time,
    updateTime: capture?.update_time,
  };
}

/**
 * Find approve link from order creation response
 */
export function getApproveLink(orderData: any): string | null {
  const approveLink = orderData.links?.find((link: any) => link.rel === 'approve');
  return approveLink?.href || null;
}
