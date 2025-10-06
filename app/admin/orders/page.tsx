import React from 'react'
import createServiceClient from '@/lib/supabase/service'
import Link from 'next/link'
import OrderPreview from '@/components/admin/order-preview'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const supabase = createServiceClient()
    const { data: orders, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (ordersErr) {
      return (
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Orders</h2>
          <p className="text-red-600">Failed to load orders: {ordersErr.message}</p>
        </div>
      )
    }

    const orderIds = (orders || []).map((o: any) => o.id).filter(Boolean)

    const { data: items } = await supabase.from('order_items').select('*').in('order_id', orderIds || [])

    const productIds = Array.from(new Set((items || []).map((it: any) => it.product_id).filter(Boolean)))
    const { data: products } = productIds.length > 0 ? await supabase.from('products').select('id, name, images, slug').in('id', productIds) : { data: [] }

    const productsById: Record<string, any> = {}
    ;(products || []).forEach((p: any) => { productsById[p.id] = p })

    const itemsByOrder: Record<string, any[]> = {}
    ;(items || []).forEach((it: any) => {
      itemsByOrder[it.order_id] = itemsByOrder[it.order_id] || []
      itemsByOrder[it.order_id].push(it)
    })

    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold">Orders</h1>
            <p className="text-sm text-slate-600">Manage your customer orders</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full table-auto min-w-[800px]">
            <thead className="bg-white text-sm text-slate-700 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(orders || []).map((order: any) => {
                const its = itemsByOrder[order.id] || []
                const firstItem = its[0]
                const product = firstItem ? productsById[firstItem.product_id] : null
                const thumbnail = product && product.images && product.images.length > 0 ? product.images[0] : `/placeholder.jpg`

                return (
                  <tr key={order.id} className="border-t last:border-b">
                    <td className="px-4 py-4 align-top">
                      <div className="font-mono text-xs text-slate-600">{order.id}</div>
                      <div className="text-sm text-slate-500 mt-1">{new Date(order.created_at).toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="font-semibold text-slate-900">{order.customer_email || '—'}</div>
                      <div className="text-sm text-slate-500">{order.payment_status || '—'}</div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <img src={thumbnail} alt={product?.name || firstItem?.product_name || 'Product'} className="w-14 h-14 object-cover rounded-md bg-slate-100 border" />
                        <div>
                          {its.slice(0, 3).map((it: any, i: number) => (
                            <div key={i} className="text-sm">
                              <div className="font-medium text-slate-800">{it.product_name || it.product_slug || 'Item'}</div>
                              <div className="text-slate-500 text-sm">Qty: {it.quantity} × {(it.unit_amount ?? 0) / 100}</div>
                            </div>
                          ))}
                          {its.length > 3 && <div className="text-sm text-slate-500">+{its.length - 3} more</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-right font-semibold text-slate-900">{order.amount_total != null ? `£${(Number(order.amount_total)/100).toFixed(2)}` : '—'}</td>
                    <td className="px-4 py-4 align-top text-sm text-slate-600">{order.payment_status || '—'}</td>
                    <td className="px-4 py-4 align-top text-sm">{order.resend_message_id ? <a className="text-slate-900 underline" href={`https://app.resend.com/messages/${order.resend_message_id}`} target="_blank" rel="noreferrer">View</a> : '—'}</td>
                    <td className="px-4 py-4 align-top text-center">
                      <div className="flex items-center justify-center gap-3">
                        <OrderPreview orderId={order.id} />
                        <Link href={`/admin/orders/${order.id}`} className="text-sm text-slate-700 underline">Open</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )

}
