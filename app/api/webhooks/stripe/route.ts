import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Use service role for webhook writes
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle checkout completion
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    
    try {
      // Get line items from session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      
      // Get or create customer
      let customerId = null
      if (session.customer_details?.email) {
        const { data: existingCustomer } = await supabase
          .from('customers')
          .select('id')
          .eq('email', session.customer_details.email)
          .single()
        
        if (existingCustomer) {
          customerId = existingCustomer.id
          // Update customer stats
          await supabase
            .from('customers')
            .update({
              total_orders: existingCustomer.total_orders + 1,
              total_spent: existingCustomer.total_spent + (session.amount_total || 0) / 100,
              updated_at: new Date().toISOString()
            })
            .eq('id', customerId)
        } else {
          // Create new customer
          const { data: newCustomer } = await supabase
            .from('customers')
            .insert({
              email: session.customer_details.email,
              name: session.customer_details.name || session.shipping_details?.name,
              phone: session.customer_details.phone,
              stripe_customer_id: session.customer as string,
              total_orders: 1,
              total_spent: (session.amount_total || 0) / 100
            })
            .select('id')
            .single()
          
          customerId = newCustomer?.id
        }
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent as string,
          customer_id: customerId,
          customer_email: session.customer_details?.email,
          customer_name: session.shipping_details?.name || session.customer_details?.name,
          shipping_address: session.shipping_details?.address,
          subtotal: (session.amount_subtotal || 0) / 100,
          shipping: (session.shipping_cost?.amount_total || 0) / 100,
          total: (session.amount_total || 0) / 100,
          status: 'paid',
          line_items: lineItems.data.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: (item.price?.unit_amount || 0) / 100,
            total: (item.amount_total || 0) / 100
          }))
        })
        .select('id')
        .single()

      if (orderError) {
        console.error('Failed to create order:', orderError)
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
      }

      console.log(`✓ Order created: ${order.id} for ${session.customer_details?.email}`)
      
      // TODO: Send order confirmation email
      // TODO: Decrement inventory
      
    } catch (err: any) {
      console.error('Error processing checkout:', err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
