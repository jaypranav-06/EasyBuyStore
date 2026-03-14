import Link from 'next/link';
import { ArrowLeft, Truck, Clock, MapPin } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-primary hover:text-primary-light mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Shipping Information</h1>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shipping Options</h2>
              <p className="text-gray-600 mb-6">
                We offer multiple shipping options to meet your needs. All orders are processed within 1-2 business days.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Standard Shipping</h3>
                      <p className="text-sm text-gray-600">3-7 business days</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Free for orders over Rs 10,000</p>
                    <p>Rs 500 for orders under Rs 10,000</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Available nationwide
                    </p>
                  </div>
                </div>

                <div className="border border-primary rounded-lg p-6 bg-primary/5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Express Shipping</h3>
                      <p className="text-sm text-gray-600">1-2 business days</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Rs 1,500 flat rate</p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Major cities only
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Order before 2 PM for same-day dispatch
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delivery Areas</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Standard Delivery Available:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• All districts in Sri Lanka</li>
                      <li>• Urban and suburban areas</li>
                      <li>• Rural areas (may take additional 1-2 days)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Express Delivery Available:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Colombo and suburbs</li>
                      <li>• Kandy city</li>
                      <li>• Galle city</li>
                      <li>• Other major cities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
              <p className="text-gray-600 mb-4">
                Once your order is shipped, you'll receive:
              </p>
              <ul className="space-y-3 text-gray-600 ml-6">
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  A shipping confirmation email with tracking number
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  Real-time tracking updates via SMS
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span>
                  Ability to track your order on our <Link href="/account/orders" className="text-primary hover:underline">orders page</Link>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Important Notes</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex gap-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    Orders are processed Monday to Friday, excluding public holidays
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    Delivery times may vary during peak seasons (holidays, sales events)
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    Remote areas may require additional delivery time
                  </li>
                  <li className="flex gap-3">
                    <span className="text-yellow-600 font-bold">•</span>
                    A signature may be required upon delivery for high-value orders
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
              <p className="text-gray-600">
                For any shipping-related questions, please <Link href="/contact" className="text-primary hover:underline">contact our customer service team</Link> or
                visit our <Link href="/help" className="text-primary hover:underline">Help Center</Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
