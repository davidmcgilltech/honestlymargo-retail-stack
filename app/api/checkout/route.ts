import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe key not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeKey)
    const { items } = await req.json()

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    // Calculate if free shipping applies ($99+)
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )
    const freeShipping = subtotal >= 99

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://honestlymargo-retail-stack.vercel.app'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      shipping_options: freeShipping ? [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Free shipping',
          },
        },
      ] : [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 595, currency: 'usd' },
            display_name: 'Standard shipping',
          },
        },
      ],
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
}
