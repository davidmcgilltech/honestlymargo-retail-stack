import { NextResponse } from 'next/server'

export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const hasKey = !!stripeKey
  const keyPrefix = stripeKey ? stripeKey.substring(0, 10) + '...' : 'not set'
  
  return NextResponse.json({
    hasStripeKey: hasKey,
    keyPrefix: keyPrefix,
    env: process.env.NODE_ENV,
  })
}
