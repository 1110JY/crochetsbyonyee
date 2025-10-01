import { NextResponse } from 'next/server'
import createServiceClient from '@/lib/supabase/service'

export async function POST(req: Request, { params }: { params: { product_id: string; currency: string } }) {
  // Support form posts with _method=DELETE
  const form = await req.formData()
  const method = (form.get('_method') as string) || 'POST'
  if (method.toUpperCase() === 'DELETE') return await DELETE(req, { params })
  return NextResponse.json({ error: 'Unsupported method' }, { status: 405 })
}

export async function DELETE(req: Request, { params }: { params: { product_id: string; currency: string } }) {
  try {
    const supabase = createServiceClient()
    const { product_id, currency } = params
    const { error } = await supabase.from('product_prices').delete().eq('product_id', product_id).eq('currency', currency)
    if (error) {
      console.error('Failed to delete product_price mapping', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.redirect('/admin/stripe-prices')
  } catch (err: any) {
    console.error('Error deleting mapping', err)
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 })
  }
}
