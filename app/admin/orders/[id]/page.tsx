import React from 'react'
import createServiceClient from '@/lib/supabase/service'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = createServiceClient()

  const { data: order, error } = await supabase.from('orders').select('*').eq('id', id).maybeSingle()

  if (error) return <div className="p-6">Error loading order: {error.message}</div>
  if (!order) return <div className="p-6">Order not found</div>

  const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <Card className="mb-4">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-600">Order ID</div>
              <div className="font-mono text-sm">{order.id}</div>
              <div className="text-slate-600 mt-2">Stripe Session</div>
              <div className="text-sm">{order.stripe_session_id}</div>
              <div className="text-slate-600 mt-2">Customer</div>
              <div className="text-sm">{order.customer_email || 'Unknown'}</div>
            </div>
            <div>
              <div className="text-slate-600">Total</div>
              <div className="text-lg font-semibold">{(order.amount_total ?? 0) / 100} {order.currency}</div>
              <div className="text-slate-600 mt-2">Payment Status</div>
              <div className="text-sm">{order.payment_status}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="text-lg font-semibold mb-2">Items</h3>
      <div className="space-y-2">
        {items && items.length > 0 ? (
          items.map((it: any) => (
            <Card key={it.id}>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{it.product_name}</div>
                    {it.description && <div className="text-sm text-slate-600">{it.description}</div>}
                  </div>
                  <div className="text-right">
                    <div>{(it.unit_amount ?? 0) / 100} {it.currency}</div>
                    <div className="text-sm text-slate-600">Qty: {it.quantity}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-slate-600">No items found</div>
        )}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Metadata</h3>
      <pre className="bg-slate-50 p-4 rounded border border-slate-100 text-sm">{JSON.stringify(order.metadata, null, 2)}</pre>
    </div>
  )
}
