"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Instagram } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { createBrowserClient } from "@supabase/ssr"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { CurrencySelector } from "@/components/currency-selector"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
        <div className="flex justify-between items-center h-16 md:h-18 px-4 md:px-8">
          {/* Left side - Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
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
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2">
            <Image
              src="/navlogo.png"
              alt="Crochets by On-Yee"
              width={280}
              height={70}
              className="h-20 md:h-28 w-auto"
              priority
            />
          </Link>

          {/* Right side - Auth and Social */}
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
            <div className="ml-2">
              <CurrencySelector />
            </div>

            {/* Social icons */}
            <div className="flex items-center space-x-2 ml-2 pl-2 border-l border-border">
                <a
                  href="https://www.tiktok.com/@crochetsbyonyee"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiTiktok className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                </a>

                <a
                  href="https://www.instagram.com/crochetsbyonyee/"
                  target="_blank"
                  rel="noopener noreferrer"
                >   
                  <Instagram className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                </a>
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
        {isOpen && (
          <>
            {/* Mobile menu overlay */}
            <div 
              className="fixed inset-0 z-40"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile menu dropdown */}
            <div 
              className="absolute left-0 right-0 z-50"
              style={{ 
                top: '100%',
                marginTop: '8px',
                marginLeft: '16px',
                marginRight: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '0px solid transparent',
                outline: '0px solid transparent',
                boxShadow: '0 0 0 0 transparent'
              }}
            >
              <div style={{ border: '0px solid transparent', outline: '0px solid transparent' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', border: '0px solid transparent', outline: '0px solid transparent' }}>
                  <Link
                    href="/about"
                    className="text-foreground/70 hover:text-primary font-fredoka transition-colors"
                    style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    href="/products"
                    className="text-foreground/70 hover:text-primary font-fredoka transition-colors"
                    style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Products
                  </Link>
                  <Link
                    href="/contact"
                    className="text-foreground/70 hover:text-primary font-fredoka transition-colors"
                    style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/faq"
                    className="text-foreground/70 hover:text-primary font-fredoka transition-colors"
                    style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
                    onClick={() => setIsOpen(false)}
                  >
                    FAQ
                  </Link>

                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <div style={{ paddingTop: '16px', border: '0px solid transparent', outline: '0px solid transparent' }}>
                            <Link
                              href="/protected"
                              className="text-foreground/70 hover:text-primary font-fredoka transition-colors block"
                              style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
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
                              className="text-foreground/70 hover:text-primary hover:bg-primary/10 w-fit rounded-full font-fredoka mt-2"
                              style={{ border: '0px solid transparent', outline: '0px solid transparent' }}
                            >
                              Sign Out
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ paddingTop: '16px', border: '0px solid transparent', outline: '0px solid transparent' }}>
                            <Link
                              href="/auth/login"
                              className="text-foreground/70 hover:text-primary font-fredoka transition-colors block"
                              style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
                              onClick={() => setIsOpen(false)}
                            >
                              Sign In
                            </Link>
                            <Link
                              href="/auth/sign-up"
                              className="text-foreground/70 hover:text-primary font-fredoka transition-colors block"
                              style={{ padding: '8px 0', border: '0px solid transparent', outline: '0px solid transparent' }}
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
                  <div style={{ paddingTop: '16px', border: '0px solid transparent', outline: '0px solid transparent' }}>
                    <div className="text-foreground/70 font-fredoka text-sm mb-3" style={{ border: '0px solid transparent', outline: '0px solid transparent' }}>Currency</div>
                    <CurrencySelector variant="mobile" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}