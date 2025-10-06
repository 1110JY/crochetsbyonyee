import { NextResponse } from 'next/server'
import { getProductBySlug } from '@/lib/supabase/products'

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    // `params` may be a promise in newer Next.js versions — await it before using
    const { slug } = await params as { slug?: string }
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 })

    const product = await getProductBySlug(slug)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

    return NextResponse.json({
      id: product.id,
      slug: product.slug,
      name: product.name,
      is_available: product.is_available,
      stock_quantity: product.stock_quantity,
      price: product.price,
    })
  } catch (err: any) {
    console.error('Product API error', err)
    return NextResponse.json({ error: err?.message ?? 'Internal error' }, { status: 500 })
  }
}
