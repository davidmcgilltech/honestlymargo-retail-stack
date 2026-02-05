export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-serif text-margo-charcoal mb-2">Thank You!</h1>
        <p className="text-margo-charcoal/70">Your order has been placed successfully.</p>
      </div>
      
      <div className="bg-margo-cream rounded-lg p-6 mb-8">
        <p className="text-sm text-margo-charcoal/70 mb-2">
          You'll receive a confirmation email shortly with your order details.
        </p>
        <p className="text-sm text-margo-charcoal/60">
          (This is a test order - no real charges were made)
        </p>
      </div>

      <a 
        href="/products" 
        className="inline-block bg-margo-coral text-white px-6 py-3 rounded-md hover:bg-margo-coral-dark transition-colors font-medium tracking-wide"
      >
        CONTINUE SHOPPING
      </a>
    </div>
  )
}
