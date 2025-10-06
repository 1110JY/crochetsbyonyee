import createServiceClient from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const supabase = createServiceClient()

    const { data: order } = await supabase.from('orders').select('*').eq('id', id).maybeSingle()
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id)

    return NextResponse.json({ order, items })
  } catch (err: any) {
    console.error('Admin order API error', err)
    return NextResponse.json({ error: String(err?.message ?? err) }, { status: 500 })
  }
}
