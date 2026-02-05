'use client'

import { useState } from 'react'
import { Product } from '../../../lib/supabase'

// Mock reviews for now - would come from database
const mockReviews = [
  { id: 1, name: 'Isabella C.', rating: 5, text: 'I love all of the Honestly Margo products I have purchased. My legs look great after using these products!', verified: true },
  { id: 2, name: 'Sarah M.', rating: 5, text: 'Amazing quality and smells incredible. Will definitely buy again!', verified: true },
  { id: 3, name: 'Emily R.', rating: 5, text: 'Perfect gift for my sister. She absolutely loved it!', verified: true },
]

export default function ProductDetailClient({ 
  product, 
  relatedProducts 
}: { 
  product: Product
  relatedProducts: Product[]
}) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)

  // Mock multiple images - in production, product would have an images array
  const images = (product.image_url && !imageError)
    ? [product.image_url] 
    : []

  const averageRating = mockReviews.reduce((acc, r) => acc + r.rating, 0) / mockReviews.length

  const handleBuyNow = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            name: product.name,
            price: product.price,
            quantity: quantity,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square bg-margo-cream rounded-lg overflow-hidden mb-4">
            {images.length > 0 ? (
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-margo-coral/40">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-margo-coral' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-margo-charcoal/60">
              {averageRating.toFixed(1)} ({mockReviews.length} reviews)
            </span>
          </div>

          <h1 className="text-3xl font-serif text-margo-charcoal mb-2">{product.name}</h1>
          <p className="text-2xl text-margo-coral font-medium mb-4">${product.price.toFixed(2)}</p>

          {product.description && (
            <p className="text-margo-charcoal/70 mb-6 leading-relaxed">{product.description}</p>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-margo-charcoal mb-2">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-margo-cream-dark rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-margo-charcoal hover:bg-margo-cream transition-colors"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center text-margo-charcoal font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-margo-charcoal hover:bg-margo-cream transition-colors"
                  aria-label="Increase quantity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart / Buy Now */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleBuyNow}
              disabled={loading}
              className="flex-1 bg-margo-coral hover:bg-margo-coral-dark text-white py-3 px-6 rounded-md font-medium transition-colors disabled:opacity-50 tracking-wide"
            >
              {loading ? 'LOADING...' : 'BUY NOW'}
            </button>
          </div>

          {/* Product Details */}
          <div className="border-t border-margo-cream-dark pt-6">
            <h3 className="font-medium text-margo-charcoal mb-3">Details</h3>
            <ul className="text-sm text-margo-charcoal/70 space-y-2">
              <li>• All natural ingredients</li>
              <li>• Cruelty-free & vegan</li>
              <li>• Handcrafted in small batches</li>
              <li>• Free shipping on orders $99+</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 border-t border-margo-cream-dark pt-12">
        <h2 className="text-2xl font-serif text-margo-charcoal mb-8">Customer Reviews</h2>
        <div className="grid gap-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="bg-margo-cream/50 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {review.verified && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified Buyer</span>
                )}
              </div>
              <p className="text-margo-charcoal/80 mb-2">{review.text}</p>
              <p className="text-sm text-margo-charcoal/60">— {review.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t border-margo-cream-dark pt-12">
          <h2 className="text-2xl font-serif text-margo-charcoal mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <a key={p.id} href={`/products/${p.slug}`} className="group">
                <div className="aspect-square bg-margo-cream rounded-lg overflow-hidden mb-3">
                  {p.image_url ? (
                    <img 
                      src={p.image_url} 
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-margo-coral/40">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-margo-charcoal group-hover:text-margo-coral transition-colors">{p.name}</h3>
                <p className="text-sm text-margo-coral">${p.price.toFixed(2)}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
