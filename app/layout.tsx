import type { Metadata } from 'next'
import './globals.css'
import NewsletterPopup from './components/NewsletterPopup'

export const metadata: Metadata = {
  title: 'Honestly Margo | Natural Self-Care Bath & Beauty Products',
  description: 'Discover all natural, cruelty-free self-care essentials. Shop lip balms, lotions, and aromatherapy. Free shipping on orders $99+',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-white font-sans">
        {/* Free Shipping Banner */}
        <div className="bg-margo-coral/90 text-white text-center py-2 text-sm">
          Free shipping for orders over <span className="font-semibold">$99</span>
        </div>

        <header className="bg-margo-cream border-b border-margo-cream-dark">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <svg className="w-8 h-8 text-margo-charcoal" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="text-xl sm:text-2xl font-serif font-semibold tracking-wide text-margo-charcoal">
                  HONESTLY MARGO
                </span>
              </a>
              
              {/* Navigation */}
              <div className="flex items-center gap-4 sm:gap-6">
                <a href="/products" className="text-margo-charcoal hover:text-margo-coral transition-colors text-sm font-medium tracking-wide">
                  Shop
                </a>
                {/* Search Icon */}
                <button className="text-margo-charcoal hover:text-margo-coral transition-colors" aria-label="Search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {/* Cart Icon */}
                <a href="/cart" className="relative text-margo-charcoal hover:text-margo-coral transition-colors" aria-label="Cart">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-margo-coral text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    0
                  </span>
                </a>
              </div>
            </div>
          </nav>
        </header>
        
        <main>{children}</main>
        
        <footer className="bg-margo-cream border-t border-margo-cream-dark mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-lg text-margo-charcoal mb-4 tracking-wide">HONESTLY MARGO</h3>
                <p className="text-margo-charcoal/70 text-sm leading-relaxed">
                  Natural self-care products crafted with love.
                  Cruelty-free, clean ingredients for radiant beauty.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-margo-charcoal mb-4 text-sm tracking-wide uppercase">Shop</h4>
                <ul className="space-y-2 text-sm text-margo-charcoal/70">
                  <li><a href="/products?category=lip-care" className="hover:text-margo-coral transition-colors">Lip Care</a></li>
                  <li><a href="/products?category=body-care" className="hover:text-margo-coral transition-colors">Body Care</a></li>
                  <li><a href="/products?category=aromatherapy" className="hover:text-margo-coral transition-colors">Aromatherapy</a></li>
                  <li><a href="/products?category=gift-sets" className="hover:text-margo-coral transition-colors">Gift Sets</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-margo-charcoal mb-4 text-sm tracking-wide uppercase">Support</h4>
                <ul className="space-y-2 text-sm text-margo-charcoal/70">
                  <li><a href="/contact" className="hover:text-margo-coral transition-colors">Contact Us</a></li>
                  <li><a href="/shipping" className="hover:text-margo-coral transition-colors">Shipping Info</a></li>
                  <li><a href="/returns" className="hover:text-margo-coral transition-colors">Returns</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-margo-cream-dark mt-8 pt-8 text-center text-sm text-margo-charcoal/60">
              <p>© 2026 Honestly Margo. All rights reserved.</p>
            </div>
          </div>
        </footer>
        
        <NewsletterPopup />
      </body>
    </html>
  )
}
