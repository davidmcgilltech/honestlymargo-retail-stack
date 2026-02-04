import { createClient } from '@/lib/supabase'

async function getProducts(category?: string) {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data: products } = await query
  return products || []
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const products = await getProducts(searchParams.category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-gray-900">
          {searchParams.category || 'All Products'}
        </h1>
        <div className="flex gap-2">
          <a href="/products" className="px-3 py-1 rounded-full text-sm border hover:bg-rose-50">
            All
          </a>
          <a href="/products?category=Lip Care" className="px-3 py-1 rounded-full text-sm border hover:bg-rose-50">
            Lip Care
          </a>
          <a href="/products?category=Body Care" className="px-3 py-1 rounded-full text-sm border hover:bg-rose-50">
            Body Care
          </a>
          <a href="/products?category=Aromatherapy" className="px-3 py-1 rounded-full text-sm border hover:bg-rose-50">
            Aromatherapy
          </a>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <a 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="product-card group"
            >
              <div className="aspect-square bg-rose-50 rounded-lg overflow-hidden mb-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-rose-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-rose-900 transition-colors">
                {product.name}
              </h3>
              <p className="text-rose-900 font-medium mt-1">
                ${product.price.toFixed(2)}
              </p>
              {product.tags?.includes('best-seller') && (
                <span className="inline-block mt-2 text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              {product.tags?.includes('trending') && (
                <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  Trending
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
