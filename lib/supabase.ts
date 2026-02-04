import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!url || !key) {
    // Return a mock client for build time
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => ({
              limit: () => Promise.resolve({ data: [], error: null })
            })
          })
        })
      })
    } as any
  }
  
  return createSupabaseClient(url, key)
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  image_url: string | null
  category: string | null
  tags: string[] | null
  inventory_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ProductVariant = {
  id: string
  product_id: string
  name: string
  sku: string | null
  price: number | null
  inventory_count: number
}

export type CartItem = {
  product: Product
  variant?: ProductVariant
  quantity: number
}
