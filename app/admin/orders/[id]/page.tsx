import { createClient } from '../../../../lib/supabase'
import { notFound } from 'next/navigation'
import OrderActions from './OrderActions'

async function getOrder(id: string) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()
  
  return order
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrder(id)
  
  if (!order) {
    notFound()
  }

  const address = order.shipping_address as any

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a href="/admin" className="text-rose-600 hover:text-rose-800">← Back to Orders</a>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-500 font-mono">{order.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
            order.status === 'shipped' ? 'bg-green-100 text-green-800' :
            order.status === 'delivered' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {order.status.toUpperCase()}
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Name:</span> {order.customer_name || 'N/A'}</p>
              <p><span className="text-gray-500">Email:</span> {order.customer_email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            {address ? (
              <div className="text-sm space-y-1">
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No shipping address</p>
            )}
          </div>

          {/* Order Items */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <div className="border rounded-lg divide-y">
              {order.line_items?.map((item: any, i: number) => (
                <div key={i} className="p-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${item.total?.toFixed(2)}</p>
                </div>
              )) || (
                <div className="p-4 text-gray-500">No items recorded</div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>${order.shipping?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          {order.tracking_number && (
            <div className="md:col-span-2 bg-green-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Tracking</h2>
              <p className="text-sm">
                <span className="text-gray-500">Carrier:</span> {order.tracking_carrier}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Tracking #:</span> {order.tracking_number}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="md:col-span-2 border-t pt-6">
            <OrderActions order={order} />
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="mt-6 text-sm text-gray-500">
        <p>Created: {new Date(order.created_at).toLocaleString()}</p>
        {order.shipped_at && <p>Shipped: {new Date(order.shipped_at).toLocaleString()}</p>}
        {order.delivered_at && <p>Delivered: {new Date(order.delivered_at).toLocaleString()}</p>}
      </div>
    </div>
  )
}
