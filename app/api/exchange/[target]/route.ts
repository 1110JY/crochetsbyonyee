import { NextResponse } from 'next/server'
import { getRate } from '@/lib/exchange'

export async function GET(req: Request, { params }: { params: { target: string } }) {
  try {
    const target = (params.target || '').toUpperCase()
    if (!target) return NextResponse.json({ error: 'Missing target currency' }, { status: 400 })

    const rate = await getRate(target, 'GBP')
    if (!rate) return NextResponse.json({ error: 'Rate not found' }, { status: 404 })
    return NextResponse.json({ base: 'GBP', target, rate })
  } catch (err: any) {
    console.error('Exchange API error', err)
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 })
  }
}
