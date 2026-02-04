import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HonestlyMargoRetail™ | Natural Beauty Products',
  description: 'Shop natural lip balms, lotions, and aromatherapy products. Free shipping on orders $99+',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <header className="border-b">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <a href="/" className="text-2xl font-serif text-rose-900">
                HonestlyMargo
              </a>
              <div className="flex items-center gap-6">
                <a href="/products" className="text-gray-700 hover:text-rose-900">
                  Shop
                </a>
                <a href="/cart" className="text-gray-700 hover:text-rose-900">
                  Cart (0)
                </a>
              </div>
            </div>
          </nav>
        </header>
        
        <main>{children}</main>
        
        <footer className="bg-rose-50 border-t mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-lg text-rose-900 mb-4">HonestlyMargoRetail™</h3>
                <p className="text-gray-600 text-sm">
                  Natural self-care products crafted with love.
                  Free shipping on orders $99+
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/products?category=lip-care" className="hover:text-rose-900">Lip Care</a></li>
                  <li><a href="/products?category=body-care" className="hover:text-rose-900">Body Care</a></li>
                  <li><a href="/products?category=aromatherapy" className="hover:text-rose-900">Aromatherapy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/contact" className="hover:text-rose-900">Contact Us</a></li>
                  <li><a href="/shipping" className="hover:text-rose-900">Shipping Info</a></li>
                  <li><a href="/returns" className="hover:text-rose-900">Returns</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-gray-500">
              <p>
                <a href="https://github.com/davidmcgilltech" className="hover:text-rose-900">davidmcgilltech</a>
                {' '} | McGill Technologies OKC
              </p>
              <p className="mt-1">© 2026 HonestlyMargoRetail™. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
