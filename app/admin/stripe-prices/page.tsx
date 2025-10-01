"use server"
import createServiceClient from '@/lib/supabase/service'
import Link from 'next/link'

export default async function Page() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.from('product_prices').select('product_id,currency,stripe_price_id,created_at')
  if (error) {
    return <div className="p-6">Error loading price mappings: {String(error.message)}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Stripe Price mappings</h1>
      {(!data || data.length === 0) && <div>No price mappings found.</div>}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left">
            <th className="p-2">Product ID</th>
            <th className="p-2">Currency</th>
            <th className="p-2">Stripe Price ID</th>
            <th className="p-2">Created</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row: any) => (
            <tr key={`${row.product_id}-${row.currency}`} className="border-t">
              <td className="p-2">{row.product_id}</td>
              <td className="p-2">{row.currency}</td>
              <td className="p-2">{row.stripe_price_id}</td>
              <td className="p-2">{new Date(row.created_at).toLocaleString()}</td>
              <td className="p-2">
                <form action={`/api/admin/product-prices/${encodeURIComponent(row.product_id)}/${encodeURIComponent(row.currency)}`} method="POST">
                  <input type="hidden" name="_method" value="DELETE" />
                  <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Link href="/admin">← Back to admin</Link>
      </div>
    </div>
  )
}
