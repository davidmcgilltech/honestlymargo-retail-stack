import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  extractShippingDetails,
  transformLineItems,
  buildOrderData,
  qualifiesForFreeShipping,
  type CheckoutSession,
  type LineItem,
} from './order-utils.ts'

describe('extractShippingDetails', () => {
  it('extracts from collected_information.shipping_details (preferred)', () => {
    const session: CheckoutSession = {
      id: 'cs_test_123',
      payment_intent: 'pi_123',
      amount_subtotal: 5000,
      amount_total: 5000,
      collected_information: {
        shipping_details: {
          name: 'Alice Smith',
          address: {
            line1: '123 Main St',
            city: 'Austin',
            state: 'TX',
            postal_code: '78701',
            country: 'US',
          },
        },
      },
      customer_details: {
        email: 'alice@example.com',
        name: 'Alice Different',
        address: {
          line1: '456 Other St',
          city: 'Dallas',
          state: 'TX',
          postal_code: '75201',
          country: 'US',
        },
      },
    }

    const result = extractShippingDetails(session)
    
    assert.strictEqual(result.name, 'Alice Smith')
    assert.strictEqual(result.address?.line1, '123 Main St')
    assert.strictEqual(result.address?.city, 'Austin')
  })

  it('falls back to shipping_details', () => {
    const session: CheckoutSession = {
      id: 'cs_test_123',
      payment_intent: 'pi_123',
      amount_subtotal: 5000,
      amount_total: 5000,
      shipping_details: {
        name: 'Bob Jones',
        address: {
          line1: '789 Elm St',
          city: 'Houston',
          state: 'TX',
          postal_code: '77001',
          country: 'US',
        },
      },
    }

    const result = extractShippingDetails(session)
    
    assert.strictEqual(result.name, 'Bob Jones')
    assert.strictEqual(result.address?.city, 'Houston')
  })

  it('falls back to customer_details', () => {
    const session: CheckoutSession = {
      id: 'cs_test_123',
      payment_intent: 'pi_123',
      amount_subtotal: 5000,
      amount_total: 5000,
      customer_details: {
        email: 'carol@example.com',
        name: 'Carol White',
        address: {
          line1: '321 Oak Ave',
          city: 'San Antonio',
          state: 'TX',
          postal_code: '78201',
          country: 'US',
        },
      },
    }

    const result = extractShippingDetails(session)
    
    assert.strictEqual(result.name, 'Carol White')
    assert.strictEqual(result.address?.city, 'San Antonio')
  })

  it('returns null when no shipping info available', () => {
    const session: CheckoutSession = {
      id: 'cs_test_123',
      payment_intent: 'pi_123',
      amount_subtotal: 5000,
      amount_total: 5000,
    }

    const result = extractShippingDetails(session)
    
    assert.strictEqual(result.name, null)
    assert.strictEqual(result.address, null)
  })
})

describe('transformLineItems', () => {
  it('transforms Stripe line items to order format', () => {
    const lineItems: LineItem[] = [
      {
        description: 'Lavender Lip Balm',
        quantity: 2,
        price: { unit_amount: 899 },
        amount_total: 1798,
      },
      {
        description: 'Rose Body Lotion',
        quantity: 1,
        price: { unit_amount: 2499 },
        amount_total: 2499,
      },
    ]

    const result = transformLineItems(lineItems)

    assert.strictEqual(result.length, 2)
    assert.deepStrictEqual(result[0], {
      description: 'Lavender Lip Balm',
      quantity: 2,
      unit_price: 8.99,
      total: 17.98,
    })
    assert.deepStrictEqual(result[1], {
      description: 'Rose Body Lotion',
      quantity: 1,
      unit_price: 24.99,
      total: 24.99,
    })
  })

  it('handles missing price data', () => {
    const lineItems: LineItem[] = [
      {
        description: 'Mystery Item',
        quantity: 1,
        amount_total: 1000,
      },
    ]

    const result = transformLineItems(lineItems)

    assert.strictEqual(result[0].unit_price, 0)
    assert.strictEqual(result[0].total, 10)
  })
})

describe('buildOrderData', () => {
  it('builds complete order data from session', () => {
    const session: CheckoutSession = {
      id: 'cs_test_abc123',
      payment_intent: 'pi_xyz789',
      amount_subtotal: 5000,
      amount_total: 5595,
      shipping_cost: { amount_total: 595 },
      customer_details: {
        email: 'test@example.com',
        name: 'Test User',
        address: {
          line1: '100 Test Lane',
          city: 'Testville',
          state: 'TX',
          postal_code: '00000',
          country: 'US',
        },
      },
    }

    const lineItems: LineItem[] = [
      {
        description: 'Test Product',
        quantity: 2,
        price: { unit_amount: 2500 },
        amount_total: 5000,
      },
    ]

    const result = buildOrderData(session, lineItems, 'cust_123')

    assert.deepStrictEqual(result, {
      stripe_session_id: 'cs_test_abc123',
      stripe_payment_intent: 'pi_xyz789',
      customer_id: 'cust_123',
      customer_email: 'test@example.com',
      customer_name: 'Test User',
      shipping_address: {
        line1: '100 Test Lane',
        city: 'Testville',
        state: 'TX',
        postal_code: '00000',
        country: 'US',
      },
      subtotal: 50,
      shipping: 5.95,
      total: 55.95,
      status: 'paid',
      line_items: [
        {
          description: 'Test Product',
          quantity: 2,
          unit_price: 25,
          total: 50,
        },
      ],
    })
  })
})

describe('qualifiesForFreeShipping', () => {
  it('returns true when subtotal meets threshold', () => {
    assert.strictEqual(qualifiesForFreeShipping(9900), true)   // Exactly $99
    assert.strictEqual(qualifiesForFreeShipping(10000), true)  // $100
    assert.strictEqual(qualifiesForFreeShipping(15000), true)  // $150
  })

  it('returns false when subtotal below threshold', () => {
    assert.strictEqual(qualifiesForFreeShipping(9899), false)  // $98.99
    assert.strictEqual(qualifiesForFreeShipping(5000), false)  // $50
    assert.strictEqual(qualifiesForFreeShipping(0), false)     // $0
  })

  it('supports custom threshold', () => {
    assert.strictEqual(qualifiesForFreeShipping(5000, 50), true)   // $50 threshold
    assert.strictEqual(qualifiesForFreeShipping(4999, 50), false)
  })
})
