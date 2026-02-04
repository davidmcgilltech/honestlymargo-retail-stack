'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OrderActions({ order }: { order: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || '')
  const [trackingCarrier, setTrackingCarrier] = useState(order.tracking_carrier || 'USPS')

  const updateStatus = async (newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: newStatus,
        }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to update status')
      }
    } catch (e) {
      alert('Error updating status')
    }
    setLoading(false)
  }

  const addTracking = async () => {
    if (!trackingNumber) {
      alert('Please enter a tracking number')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          status: 'shipped',
          trackingNumber,
          trackingCarrier,
        }),
      })
      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to add tracking')
      }
    } catch (e) {
      alert('Error adding tracking')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Actions</h2>
      
      {/* Quick Status Updates */}
      <div className="flex flex-wrap gap-2">
        {order.status === 'paid' && (
          <button
            onClick={() => updateStatus('processing')}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Mark Processing
          </button>
        )}
        {order.status === 'shipped' && (
          <button
            onClick={() => updateStatus('delivered')}
            disabled={loading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            Mark Delivered
          </button>
        )}
        {!['cancelled', 'refunded', 'delivered'].includes(order.status) && (
          <button
            onClick={() => updateStatus('cancelled')}
            disabled={loading}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Shipping Form */}
      {['paid', 'processing'].includes(order.status) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Add Shipping Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
              <select
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="USPS">USPS</option>
                <option value="UPS">UPS</option>
                <option value="FedEx">FedEx</option>
                <option value="DHL">DHL</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <button
            onClick={addTracking}
            disabled={loading || !trackingNumber}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Mark Shipped & Save Tracking'}
          </button>
        </div>
      )}
    </div>
  )
}
