import { createClient, Product } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  
  return product
}

async function getRelatedProducts(category: string | null, excludeId: string): Promise<Product[]> {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(4)
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data: products } = await query
  return products || []
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProduct(slug)
  
  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />
}
