"use client"

import React, { useState } from 'react'

export default function OrderPreview({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)

  async function openPreview() {
    setOpen(true)
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/order/${orderId}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setData({ error: String(e) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={openPreview} className="text-sm text-slate-700 underline">Preview</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[90%] max-w-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Preview</h3>
              <button onClick={() => setOpen(false)} className="text-sm text-slate-500">Close</button>
            </div>

            {loading ? (
              <div>Loading…</div>
            ) : data?.error ? (
              <div className="text-red-600">{data.error}</div>
            ) : (
              <div>
                <div className="mb-4">
                  <div className="text-sm text-slate-500">Order ID</div>
                  <div className="font-mono text-sm">{data?.order?.id}</div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Items</h4>
                  <div className="space-y-2">
                    {data?.items?.map((it: any) => (
                      <div key={it.id} className="flex justify-between">
                        <div>
                          <div className="font-medium">{it.product_name || it.product_slug}</div>
                          <div className="text-sm text-slate-500">Qty: {it.quantity}</div>
                        </div>
                        <div className="text-sm">{(it.unit_amount ?? 0) / 100}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">Metadata</h4>
                  <pre className="bg-slate-50 p-2 rounded text-sm">{JSON.stringify(data?.order?.metadata || {}, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
