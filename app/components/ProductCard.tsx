'use client'

import { useState } from 'react'
import { Product } from '../../lib/supabase'

export default function ProductCard({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image_url,
          }]
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Checkout error: ' + (data.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-card group">
      <a href={`/products/${product.slug}`}>
        <div className="aspect-square bg-rose-50 rounded-lg overflow-hidden mb-4">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-rose-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
        <div className="flex gap-1 flex-wrap mt-2">
          {product.tags?.includes('best-seller') && (
            <span className="text-xs bg-rose-100 text-rose-800 px-2 py-1 rounded-full">
              Best Seller
            </span>
          )}
          {product.tags?.includes('trending') && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              Trending
            </span>
          )}
        </div>
      </a>
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="w-full mt-4 bg-rose-900 text-white py-2 px-4 rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Loading...' : 'Buy Now'}
      </button>
    </div>
  )
}
