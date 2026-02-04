import { createClient } from '../../lib/supabase'

export const dynamic = 'force-dynamic'

async function getOrders() {
  const supabase = createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  
  return orders || []
}

async function getStats() {
  const supabase = createClient()
  
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, created_at')
  
  if (!orders) return { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 }
  
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  const pendingOrders = orders.filter((o: any) => o.status === 'paid' || o.status === 'processing').length
  
  return {
    totalRevenue,
    totalOrders: orders.length,
    pendingOrders
  }
}

export default async function AdminPage() {
  const orders = await getOrders()
  const stats = await getStats()

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Order Management</h1>
      
      {/* Stats - responsive grid */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600">Revenue</p>
          <p className="text-xl sm:text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600">Orders</p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <p className="text-xs sm:text-sm text-gray-600">Pending</p>
          <p className="text-xl sm:text-3xl font-bold text-blue-600">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-3">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
            No orders yet.
          </div>
        ) : (
          orders.map((order: any) => (
            <a 
              key={order.id}
              href={`/admin/orders/${order.id}`}
              className="block bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{order.customer_name || 'No name'}</p>
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">{order.customer_email}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {order.line_items?.length || 0} item(s) • {new Date(order.created_at).toLocaleDateString()}
                </span>
                <span className="font-semibold text-gray-900">${order.total?.toFixed(2)}</span>
              </div>
            </a>
          ))
        )}
      </div>

      {/* Desktop: Table layout */}
      <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-600">
                  No orders yet. Orders will appear here when customers complete checkout.
                </td>
              </tr>
            ) : (
              orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">
                      {order.id.slice(0, 8)}...
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{order.customer_name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{order.customer_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.line_items?.length || 0} item(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      ${order.total?.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`/admin/orders/${order.id}`}
                      className="text-rose-600 hover:text-rose-900 text-sm font-medium"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
