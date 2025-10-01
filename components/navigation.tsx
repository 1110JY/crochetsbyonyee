"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Instagram } from "lucide-react"
import { ShoppingCart } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { createBrowserClient } from "@supabase/ssr"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { CurrencySelector } from "@/components/currency-selector"
import { useCart } from "./cart-context"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, setOpen, open } = useCart()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    // mark hydrated on client so UI that depends on localStorage-driven state
    // doesn't cause a server/client render mismatch
    setHydrated(true)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="fixed top-4 left-0 z-50 px-4" style={{ right: 'var(--cart-offset, 0px)', transition: 'right 300ms ease-in-out' }}>
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-full shadow-lg" style={{ transition: 'width 300ms ease-in-out' }}>
        <div className="flex justify-between items-center h-16 md:h-18 px-4 md:px-8">
          {/* Left side - Socials then Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Social icons moved to the left with a bigger divider and improved spacing */}
            <div className="flex items-center space-x-2 mr-6 pr-4 border-r-2 border-border">
              <a
                href="https://www.tiktok.com/@crochetsbyonyee"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiTiktok className="w-4 h-4" />
              </a>

              <a
                href="https://www.instagram.com/crochetsbyonyee/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <Link href="/about" className="text-foreground/70 hover:text-primary font-fredoka transition-colors">
              About
            </Link>
            <Link href="/products" className="text-foreground/70 hover:text-primary font-fredoka transition-colors">
              Products
            </Link>
            <Link href="/contact" className="text-foreground/70 hover:text-primary font-fredoka transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-foreground/70 hover:text-primary font-fredoka transition-colors">
              FAQ
            </Link>
          </div>

          {/* Center - Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2" onClick={(e) => {
            // If the cart is open, clicking the logo should close it instead of navigating
            if ((window as any).__cartOpen) {
              e.preventDefault()
              setOpen(false)
            }
          }}>
            <Image
              src="/navlogo.png"
              alt="Crochets by On-Yee"
              width={280}
              height={70}
              className="h-20 md:h-28 w-auto"
              priority
            />
          </Link>

          {/* Right side - Auth, Currency and Cart (cart moved to the far right) */}
          <div className="hidden md:flex items-center space-x-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/protected"
                      className="text-foreground/70 hover:text-primary font-fredoka transition-colors"
                    >
                      Account
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-full font-fredoka"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-full font-fredoka"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary bg-transparent rounded-full font-fredoka"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Currency Selector */}
            <div className="ml-3">
              <CurrencySelector />
            </div>

            {/* Cart button moved to the far right where socials were (no divider) */}
            <div className="relative ml-3">
              <button onClick={() => setOpen(!open)} className="p-2 rounded-full hover:bg-primary/10" aria-expanded={open} aria-controls="cart-sidebar">
                <ShoppingCart className="w-5 h-5 text-foreground/70" />
              </button>
              {hydrated && items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{items.reduce((s, i) => s + i.quantity, 0)}</span>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-foreground/70 hover:text-primary hover:bg-primary/10 rounded-full">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          {/* Mobile menu overlay */}
          <div 
            className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            onClick={() => setIsOpen(false)}
          />
          
          {/* Mobile menu dropdown */}
          <div 
            className={`absolute left-0 right-0 z-50 transform transition-all duration-300 ease-out ${
              isOpen 
                ? 'translate-y-0 opacity-100 scale-100' 
                : '-translate-y-4 opacity-0 scale-95 pointer-events-none'
            }`}
            style={{ 
              top: '100%',
              marginTop: '8px',
              marginLeft: '16px',
              marginRight: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="animate-in fade-in-0 slide-in-from-top-4 duration-300">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/about"
                  className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/products"
                  className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/contact"
                  className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/faq"
                  className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1"
                  onClick={() => setIsOpen(false)}
                >
                  FAQ
                </Link>

                {/* Mobile cart entry */}
                <button onClick={() => { setOpen(true); setIsOpen(false) }} className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 text-left">
                  View cart{hydrated ? ` (${items.reduce((s, i) => s + i.quantity, 0)})` : ''}
                </button>

                {!loading && (
                  <>
                    {user ? (
                      <>
                        <div className="pt-4 border-t border-gray-100">
                          <Link
                            href="/protected"
                            className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1 block"
                            onClick={() => setIsOpen(false)}
                          >
                            Account
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleSignOut()
                              setIsOpen(false)
                            }}
                            className="text-foreground/70 hover:text-primary hover:bg-primary/10 w-fit rounded-full font-fredoka mt-2 transition-all duration-200 transform hover:scale-105"
                          >
                            Sign Out
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="pt-4 border-t border-gray-100">
                          <Link
                            href="/auth/login"
                            className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1 block"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/auth/sign-up"
                            className="text-foreground/70 hover:text-primary font-fredoka transition-all duration-200 py-2 px-3 rounded-lg hover:bg-primary/5 transform hover:translate-x-1 block"
                            onClick={() => setIsOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Mobile Currency Selector */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-foreground/70 font-fredoka text-sm mb-3">Currency</div>
                  <CurrencySelector variant="mobile" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating mobile cart button */}
  <div className="md:hidden fixed bottom-12 right-3 z-60">
        <button onClick={() => setOpen(!open)} className="bg-primary text-white p-3 rounded-full shadow-lg flex items-center justify-center relative" aria-expanded={open} aria-controls="cart-sidebar">
          <ShoppingCart className="w-5 h-5" />
          {hydrated && items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-primary rounded-full text-xs w-5 h-5 flex items-center justify-center">{items.reduce((s, i) => s + i.quantity, 0)}</span>
          )}
        </button>
      </div>
    </nav>
  )
}