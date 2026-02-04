/**
 * Order processing utilities - extracted for testability
 */

export interface CheckoutSession {
  id: string
  payment_intent: string
  amount_subtotal: number
  amount_total: number
  shipping_cost?: { amount_total: number }
  customer_details?: {
    email: string
    name: string
    phone?: string
    address?: Address
  }
  shipping_details?: {
    name: string
    address: Address
  }
  collected_information?: {
    shipping_details?: {
      name: string
      address: Address
    }
  }
  customer?: string
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface LineItem {
  description: string
  quantity: number
  price?: { unit_amount: number }
  amount_total: number
}

export interface OrderData {
  stripe_session_id: string
  stripe_payment_intent: string
  customer_id: string | null
  customer_email: string | null
  customer_name: string | null
  shipping_address: Address | null
  subtotal: number
  shipping: number
  total: number
  status: string
  line_items: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
}

/**
 * Extract shipping details from checkout session
 * Stripe puts shipping info in different places depending on the flow
 */
export function extractShippingDetails(session: CheckoutSession): {
  name: string | null
  address: Address | null
} {
  const shippingDetails = 
    session.collected_information?.shipping_details ||
    session.shipping_details ||
    null

  const address = shippingDetails?.address || session.customer_details?.address || null
  const name = shippingDetails?.name || session.customer_details?.name || null

  return { name, address }
}

/**
 * Transform Stripe line items to our order format
 */
export function transformLineItems(lineItems: LineItem[]): OrderData['line_items'] {
  return lineItems.map(item => ({
    description: item.description,
    quantity: item.quantity,
    unit_price: (item.price?.unit_amount || 0) / 100,
    total: (item.amount_total || 0) / 100,
  }))
}

/**
 * Build order data from checkout session
 */
export function buildOrderData(
  session: CheckoutSession,
  lineItems: LineItem[],
  customerId: string | null
): OrderData {
  const { name, address } = extractShippingDetails(session)
  
  return {
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent,
    customer_id: customerId,
    customer_email: session.customer_details?.email || null,
    customer_name: name,
    shipping_address: address,
    subtotal: (session.amount_subtotal || 0) / 100,
    shipping: (session.shipping_cost?.amount_total || 0) / 100,
    total: (session.amount_total || 0) / 100,
    status: 'paid',
    line_items: transformLineItems(lineItems),
  }
}

/**
 * Calculate whether order qualifies for free shipping
 */
export function qualifiesForFreeShipping(subtotalCents: number, thresholdDollars = 99): boolean {
  return subtotalCents >= thresholdDollars * 100
}
