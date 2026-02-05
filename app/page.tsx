import { createClient, Product } from '../lib/supabase'

async function getProducts() {
  const supabase = createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)
  
  return products || []
}

export default async function Home() {
  const products = await getProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-margo-cream py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-margo-charcoal mb-6 leading-tight">
            Nurture Your Body,<br />Elevate Your Beauty
          </h1>
          <p className="text-lg text-margo-charcoal/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover all natural, cruelty-free self-care essentials designed to empower you 
            with radiant, healthy beauty — because you deserve products as pure as you are.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/products" className="bg-margo-coral hover:bg-margo-coral-dark text-white px-8 py-3 rounded-md font-medium transition-colors tracking-wide">
              SHOP NOW
            </a>
            <a href="/products?category=gift-sets" className="border-2 border-margo-charcoal text-margo-charcoal hover:bg-margo-charcoal hover:text-white px-8 py-3 rounded-md font-medium transition-colors tracking-wide">
              GIFT SETS
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-margo-charcoal text-center mb-4">
            Shop Our Favorites
          </h2>
          <p className="text-margo-charcoal/60 text-center mb-12 max-w-xl mx-auto">
            Hand-selected products to kick off your self-care routine
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product: Product) => (
              <a 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="group"
              >
                <div className="aspect-square bg-margo-cream rounded-lg overflow-hidden mb-4">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-margo-coral/40">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-margo-charcoal group-hover:text-margo-coral transition-colors">
                  {product.name}
                </h3>
                <p className="text-margo-coral font-medium mt-1">
                  ${product.price.toFixed(2)}
                </p>
                {product.tags?.includes('best-seller') && (
                  <span className="inline-block mt-2 text-xs bg-margo-coral/10 text-margo-coral px-2 py-1 rounded-full">
                    Best Seller
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/products" className="inline-block border-2 border-margo-charcoal text-margo-charcoal hover:bg-margo-charcoal hover:text-white px-8 py-3 rounded-md font-medium transition-colors tracking-wide">
              VIEW ALL PRODUCTS
            </a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="bg-margo-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-margo-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="font-medium text-margo-charcoal mb-2">All Natural</h3>
              <p className="text-margo-charcoal/60 text-sm">
                Clean ingredients, no parabens or artificial fragrances
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-margo-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐰</span>
              </div>
              <h3 className="font-medium text-margo-charcoal mb-2">Cruelty Free</h3>
              <p className="text-margo-charcoal/60 text-sm">
                Never tested on animals, always kind and ethical
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-margo-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="font-medium text-margo-charcoal mb-2">Made with Love</h3>
              <p className="text-margo-charcoal/60 text-sm">
                Small batch production by a mother-daughter duo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-serif text-margo-charcoal mb-4">
            Join the Margo Family
          </h2>
          <p className="text-margo-charcoal/60 mb-6">
            Get 15% off your first order + exclusive access to new products and sales.
          </p>
          <form className="flex gap-2 flex-col sm:flex-row">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-margo-cream-dark rounded-md focus:outline-none focus:ring-2 focus:ring-margo-coral focus:border-transparent"
            />
            <button type="submit" className="bg-margo-coral hover:bg-margo-coral-dark text-white px-6 py-3 rounded-md font-medium transition-colors tracking-wide">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
