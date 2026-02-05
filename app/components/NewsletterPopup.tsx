'use client'

import { useState, useEffect } from 'react'

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user has already seen/dismissed the popup
    const dismissed = localStorage.getItem('newsletter_dismissed')
    const subscribed = localStorage.getItem('newsletter_subscribed')
    
    if (!dismissed && !subscribed) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter_dismissed', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // TODO: Connect to email service (Mailchimp, ConvertKit, etc.)
    // For now, just simulate success
    await new Promise(resolve => setTimeout(resolve, 500))
    
    localStorage.setItem('newsletter_subscribed', 'true')
    setSubmitted(true)
    setLoading(false)
    
    // Auto close after showing success
    setTimeout(() => {
      setIsOpen(false)
    }, 2500)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#FDF8F3] rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#E8998D]/80 hover:bg-[#E8998D] text-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get 15% Off!
            </h2>
            
            <p className="text-gray-700 mb-2">
              Join the Honestly Margo Family and get
            </p>
            <p className="font-bold text-gray-900 mb-6">
              15% Off Your Next Order!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                required
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#E8998D] focus:border-transparent"
              />
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#E8998D] hover:bg-[#E07A6C] text-white font-semibold rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? 'SIGNING UP...' : 'GET MY 15% OFF CODE'}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600 italic">
              By signing up, you agree to receive Honestly Margo emails. 
              You can unsubscribe anytime, but we're confident you'll love it here!
            </p>
          </>
        ) : (
          <div className="py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're In!</h3>
            <p className="text-gray-600">Check your email for your 15% off code.</p>
          </div>
        )}
      </div>
    </div>
  )
}
