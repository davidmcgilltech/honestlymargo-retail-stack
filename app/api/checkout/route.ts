import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY
    
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe key not configured' }, { status: 500 })
    }

    const { items } = await req.json()

    // Build line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const freeShipping = subtotal >= 99
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://honestlymargo-retail-stack.vercel.app'

    // Use raw fetch to Stripe API
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': `${siteUrl}/success`,
        'cancel_url': `${siteUrl}/cart`,
        'shipping_address_collection[allowed_countries][0]': 'US',
        'shipping_address_collection[allowed_countries][1]': 'CA',
        'shipping_options[0][shipping_rate_data][type]': 'fixed_amount',
        'shipping_options[0][shipping_rate_data][fixed_amount][amount]': freeShipping ? '0' : '595',
        'shipping_options[0][shipping_rate_data][fixed_amount][currency]': 'usd',
        'shipping_options[0][shipping_rate_data][display_name]': freeShipping ? 'Free shipping' : 'Standard shipping',
        ...lineItems.reduce((acc: any, item: any, i: number) => ({
          ...acc,
          [`line_items[${i}][price_data][currency]`]: item.price_data.currency,
          [`line_items[${i}][price_data][product_data][name]`]: item.price_data.product_data.name,
          [`line_items[${i}][price_data][unit_amount]`]: String(item.price_data.unit_amount),
          [`line_items[${i}][quantity]`]: String(item.quantity),
        }), {}),
      }).toString(),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Stripe error', details: data }, { status: response.status })
    }

    return NextResponse.json({ sessionId: data.id, url: data.url })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
