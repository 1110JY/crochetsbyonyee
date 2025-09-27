import React from 'react'
import createServiceClient from '@/lib/supabase/service'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const supabase = createServiceClient()
  const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50)

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Orders</h2>
        <p className="text-red-600">Failed to load orders: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>
      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <Card key={order.id} className="bg-white border-slate-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-slate-500">{new Date(order.created_at).toLocaleString()}</div>
                    <div className="font-semibold text-slate-900">{order.customer_email || 'Unknown'}</div>
                    <div className="text-sm text-slate-600">Total: {(order.amount_total ?? 0) / 100} {order.currency}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-slate-600">No orders yet.</div>
        )}
      </div>
    </div>
  )
}
