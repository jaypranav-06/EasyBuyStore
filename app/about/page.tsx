import Link from 'next/link';
import { Users, Target, Award, Heart, ShoppingBag, Truck, Shield, Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">About EasyBuyStore</h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Your premier destination for quality fashion and lifestyle products
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-4 text-gray-600 leading-relaxed">
            <p>
              EasyBuyStore was founded with a simple mission: to bring high-quality, stylish products
              to customers around the world. What started as a small university project has grown into
              a passionate endeavor to create an exceptional online shopping experience.
            </p>
            <p>
              We believe that everyone deserves access to beautiful, well-crafted products that enhance
              their lifestyle. That's why we carefully curate our collection, ensuring that every item
              meets our high standards of quality and design.
            </p>
            <p>
              Our commitment goes beyond just selling products. We strive to build lasting relationships
              with our customers by providing excellent service, fast shipping, and a seamless shopping
              experience from start to finish.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully selected to meet our high standards.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to ensure you have the best experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform to provide you with the best shopping experience.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600">
                We're building a community of fashion enthusiasts who share our passion for style.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Wide Selection</h3>
                <p className="text-gray-600">
                  Discover thousands of products across multiple categories, from fashion to
                  lifestyle essentials.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-gray-600">
                  Free shipping on orders over Rs 10,000. Get your items delivered quickly and safely.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Payment</h3>
                <p className="text-gray-600">
                  Shop with confidence. Your payment information is always secure with our encrypted
                  checkout.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Top Rated</h3>
                <p className="text-gray-600">
                  Join thousands of satisfied customers who trust us for their shopping needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-12 text-white mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">10k+</p>
              <p className="text-gray-100">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">5k+</p>
              <p className="text-gray-100">Products</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50+</p>
              <p className="text-gray-100">Categories</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">4.8</p>
              <p className="text-gray-100">Average Rating</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Shopping?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore our collection and discover products that match your style and lifestyle.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-lg font-semibold hover:from-primary-light hover:to-accent-light transition"
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
