import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase credentials')
  }
  return createClient(url, key)
}

export async function POST(req: Request) {
  try {
    const { orderId, status, trackingNumber, trackingCarrier } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updates.status = status
    }

    if (trackingNumber) {
      updates.tracking_number = trackingNumber
      updates.tracking_carrier = trackingCarrier || 'USPS'
      updates.shipped_at = new Date().toISOString()
    }

    if (status === 'delivered') {
      updates.delivered_at = new Date().toISOString()
    }

    const supabase = getSupabase()
    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)

    if (error) {
      console.error('Failed to update order:', error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    // TODO: Send shipping notification email when tracking added
    
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
