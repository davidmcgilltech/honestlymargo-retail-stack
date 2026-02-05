import { createClient, Product } from '../../lib/supabase'
import ProductCard from '../components/ProductCard'

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
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const products = await getProducts(params.category)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-serif text-margo-charcoal">
          {params.category || 'All Products'}
        </h1>
        <div className="flex gap-2 flex-wrap">
          <a href="/products" className="px-4 py-2 rounded-full text-sm border border-margo-cream-dark hover:bg-margo-cream hover:border-margo-coral text-margo-charcoal transition-colors">
            All
          </a>
          <a href="/products?category=Lip Care" className="px-4 py-2 rounded-full text-sm border border-margo-cream-dark hover:bg-margo-cream hover:border-margo-coral text-margo-charcoal transition-colors">
            Lip Care
          </a>
          <a href="/products?category=Body Care" className="px-4 py-2 rounded-full text-sm border border-margo-cream-dark hover:bg-margo-cream hover:border-margo-coral text-margo-charcoal transition-colors">
            Body Care
          </a>
          <a href="/products?category=Aromatherapy" className="px-4 py-2 rounded-full text-sm border border-margo-cream-dark hover:bg-margo-cream hover:border-margo-coral text-margo-charcoal transition-colors">
            Aromatherapy
          </a>
        </div>
      </div>

      <p className="text-sm text-margo-charcoal/60 mb-6">
        Free shipping on orders $99+ • Test mode: use card 4242 4242 4242 4242
      </p>

      {products.length === 0 ? (
        <p className="text-margo-charcoal/60 text-center py-12">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
