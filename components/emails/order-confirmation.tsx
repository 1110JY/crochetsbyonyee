import * as React from 'react'

export interface OrderItem {
  name?: string
  slug?: string
  quantity?: number
  unit_amount?: number | null
  image?: string | null
}

export interface OrderConfirmationProps {
  orderId: string
  items: OrderItem[]
  total?: number | null
  customerName?: string | null
}

const BRAND = {
  accent: '#581c87', // matches adminTheme.accent.text
  bg: '#f7f7fb',
  panelBg: '#ffffff',
  muted: '#64748b',
}

function formatPrice(amount?: number | null) {
  if (amount == null) return '—'
  return `£${(Number(amount) / 100).toFixed(2)}`
}

export default function OrderConfirmation({ orderId, items, total, customerName }: OrderConfirmationProps) {
  const rawPublicUrl = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_APP_URL) ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '') : 'https://example.com'
  const isLocalHost = (u: string) => /(^https?:\/\/localhost|^https?:\/\/127\.0\.0\.1|example\.com)/.test(u)
  // If the configured app URL is localhost or example.com, fall back to a public placeholder so Resend/recipients can fetch it
  const publicUrl = isLocalHost(rawPublicUrl) ? 'https://via.placeholder.com' : rawPublicUrl
  const logoSrc = isLocalHost(rawPublicUrl) ? 'https://via.placeholder.com/92x40.png?text=Logo' : `${publicUrl}/logo.jpg`
  const placeholderSrc = isLocalHost(rawPublicUrl) ? 'https://via.placeholder.com/64.png?text=Product' : `${publicUrl}/placeholder.jpg`

  return (
    <html>
      <body style={{ fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial', margin: 0, padding: 0, backgroundColor: BRAND.bg }}>
        <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: BRAND.bg, padding: 24 }}>
          <tbody>
            <tr>
              <td align="center">
                <table width="600" style={{ background: BRAND.panelBg, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(16,24,40,.06)', border: '1px solid #eee' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '24px 28px', borderBottom: '1px solid #f1f1f5', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={logoSrc} alt="Logo" width={92} height={40} style={{ display: 'block', objectFit: 'contain' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: BRAND.accent, fontWeight: 700, fontSize: 16 }}>Crochets by On-Yee</div>
                          <div style={{ color: BRAND.muted, fontSize: 12 }}>Handmade with care</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 12, color: '#666' }}>Order</div>
                          <div style={{ fontWeight: 700 }}>{orderId}</div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: 0 }}>
                        {/* Hero banner similar to the homepage gradient */}
                        <table width="100%" cellPadding={0} cellSpacing={0} style={{ background: 'linear-gradient(90deg,#f3c5e6,#d6b3ff)', textAlign: 'center' }}>
                          <tbody>
                            <tr>
                              <td style={{ padding: '28px 20px' }}>
                                <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: '1.1', fontFamily: 'Mochiy, Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>Handmade crochet, crafted with care</div>
                                <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.95)' }}>Unique pieces made just for you</div>
                                <div style={{ marginTop: 14 }}>
                                  <a href={`${publicUrl}/orders/${orderId}`} style={{ display: 'inline-block', padding: '10px 18px', background: BRAND.accent, color: '#fff', textDecoration: 'none', borderRadius: 9999, fontWeight: 600 }}>View your order</a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '20px 28px' }}>
                        <h2 style={{ margin: 0, color: '#111', fontSize: 18, fontFamily: 'Mochiy, Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>Thank you{customerName ? `, ${customerName}` : ''} — your order is confirmed</h2>
                        <p style={{ margin: '8px 0 16px', color: BRAND.muted }}>We received your order and will notify you when it ships.</p>

                        <table width="100%" style={{ borderCollapse: 'collapse' }}>
                          <tbody>
                            {items.map((it, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1f1f5' }}>
                                <td style={{ padding: '12px 0', verticalAlign: 'middle' }}>
                                  <table>
                                    <tbody>
                                      <tr>
                                        <td style={{ paddingRight: 12, verticalAlign: 'top' }}>
                                          <img src={(it.image && !isLocalHost(it.image) ? it.image : placeholderSrc)} alt={it.name || it.slug || 'Product'} width={64} height={64} style={{ display: 'block', objectFit: 'cover', borderRadius: 6 }} />
                                        </td>
                                        <td style={{ verticalAlign: 'top' }}>
                                          <div style={{ color: '#111', fontWeight: 600 }}>{it.name || it.slug || 'Item'}</div>
                                          <div style={{ color: BRAND.muted, fontSize: 13, marginTop: 6 }}>{(it.quantity ?? 1)} × {formatPrice(it.unit_amount)}</div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td style={{ padding: '12px 0', textAlign: 'right', verticalAlign: 'middle', color: '#111', fontWeight: 600 }}>{formatPrice((it.unit_amount ?? 0) * (it.quantity ?? 1))}</td>
                              </tr>
                            ))}

                            <tr>
                              <td style={{ paddingTop: 14, textAlign: 'left', color: '#333', fontWeight: 600 }}>Total</td>
                              <td style={{ paddingTop: 14, textAlign: 'right', color: BRAND.accent, fontWeight: 700 }}>{formatPrice(total)}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div style={{ marginTop: 20, color: BRAND.muted }}>
                          <p style={{ margin: 0 }}>If you have any questions, reply to this email or visit our contact page.</p>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: '16px 28px', background: '#fafafa', textAlign: 'center', color: '#888', fontSize: 12 }}>
                        <div>© {new Date().getFullYear()} Crochets by On-Yee</div>
                        <div style={{ marginTop: 6 }}>123 Handmade Lane • Your City • Country</div>
                        <div style={{ marginTop: 10 }}>
                          <a href="https://instagram.com" style={{ marginRight: 12, color: BRAND.accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <img src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(BRAND.accent)}'><path d='M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.5a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8.5zm5.5-2.75a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25z'/></svg>`} width="16" height="16" alt="Instagram" style={{ display: 'inline-block' }} />
                            Instagram
                          </a>
                          <a href="https://tiktok.com" style={{ marginRight: 12, color: BRAND.accent, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <img src={`data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(BRAND.accent)}'><path d='M16.5 3.5h2.25v2.25A6.75 6.75 0 0 1 12 12.5c-1.66 0-3.18-.53-4.44-1.42v2.03A8.75 8.75 0 0 0 12 15.5c4.83 0 8.75-3.92 8.75-8.75V3.5h-4.25zM9.5 13.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z'/></svg>`} width="16" height="16" alt="TikTok" style={{ display: 'inline-block' }} />
                            TikTok
                          </a>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <a href={`${publicUrl}/privacy`} style={{ marginRight: 12, color: '#666', textDecoration: 'none' }}>Privacy</a>
                          <a href={`${publicUrl}/returns`} style={{ marginRight: 12, color: '#666', textDecoration: 'none' }}>Returns</a>
                          <a href={`${publicUrl}/contact`} style={{ color: '#666', textDecoration: 'none' }}>Contact</a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}
