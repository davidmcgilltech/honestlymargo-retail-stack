import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(req: Request) {
  console.log('🔔 Webhook received')
  
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!stripeKey || !webhookSecret || !supabaseUrl || !supabaseKey) {
    console.error('❌ Missing env vars:', { stripeKey: !!stripeKey, webhookSecret: !!webhookSecret, supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey })
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey)
  const supabase = createClient(supabaseUrl, supabaseKey)

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  
  if (!sig) {
    console.error('❌ No stripe-signature header')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log('✅ Signature verified, event type:', event.type)
  } catch (err: any) {
    console.error('❌ Signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    console.log('📦 Processing checkout session:', session.id)
    
    try {
      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      console.log('📋 Line items:', lineItems.data.length)
      
      // Extract shipping info - can be in different places
      const shippingDetails = session.collected_information?.shipping_details 
        || session.shipping_details 
        || {}
      const shippingAddress = shippingDetails.address || session.customer_details?.address
      const customerName = shippingDetails.name || session.customer_details?.name
      const customerEmail = session.customer_details?.email
      
      console.log('👤 Customer:', customerName, customerEmail)
      
      // Handle customer
      let customerId = null
      if (customerEmail) {
        const { data: existingCustomer, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('email', customerEmail)
          .single()
        
        if (customerError && customerError.code !== 'PGRST116') {
          console.error('❌ Customer lookup error:', customerError)
        }
        
        if (existingCustomer) {
          customerId = existingCustomer.id
          console.log('👤 Existing customer:', customerId)
          
          await supabase
            .from('customers')
            .update({
              total_orders: (existingCustomer.total_orders || 0) + 1,
              total_spent: (existingCustomer.total_spent || 0) + (session.amount_total || 0) / 100,
              updated_at: new Date().toISOString()
            })
            .eq('id', customerId)
        } else {
          console.log('👤 Creating new customer')
          const { data: newCustomer, error: newCustError } = await supabase
            .from('customers')
            .insert({
              email: customerEmail,
              name: customerName,
              phone: session.customer_details?.phone,
              stripe_customer_id: session.customer,
              total_orders: 1,
              total_spent: (session.amount_total || 0) / 100
            })
            .select('id')
            .single()
          
          if (newCustError) {
            console.error('❌ Create customer error:', newCustError)
          } else {
            customerId = newCustomer?.id
            console.log('👤 New customer created:', customerId)
          }
        }
      }

      // Create order
      const orderData = {
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
        customer_id: customerId,
        customer_email: customerEmail,
        customer_name: customerName,
        shipping_address: shippingAddress,
        subtotal: (session.amount_subtotal || 0) / 100,
        shipping: (session.shipping_cost?.amount_total || 0) / 100,
        total: (session.amount_total || 0) / 100,
        status: 'paid',
        line_items: lineItems.data.map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: (item.price?.unit_amount || 0) / 100,
          total: (item.amount_total || 0) / 100
        }))
      }
      
      console.log('📝 Creating order:', JSON.stringify(orderData, null, 2))

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select('id')
        .single()

      if (orderError) {
        console.error('❌ Failed to create order:', orderError)
        return NextResponse.json({ error: 'Failed to create order', details: orderError }, { status: 500 })
      }

      console.log('✅ Order created:', order.id)
      
    } catch (err: any) {
      console.error('❌ Error processing checkout:', err.message, err.stack)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
