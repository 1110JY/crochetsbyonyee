"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Instagram } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { createBrowserClient } from "@supabase/ssr"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
        <div className="flex justify-between items-center h-18 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/navlogo.png"
              alt="Crochets by On-Yee"
              width={280}
              height={70}
              className="h-28 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - Batch style minimal */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-muted-foreground hover:text-primary font-light transition-colors">
              About
            </Link>
            <Link href="/products" className="text-muted-foreground hover:text-primary font-light transition-colors">
              Products
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary font-light transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-primary font-light transition-colors">
              FAQ
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-3">
                    <Link
                      href="/protected"
                      className="text-muted-foreground hover:text-primary font-light transition-colors"
                    >
                      Account
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/auth/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/sign-up">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/20 text-primary hover:bg-primary/5 bg-transparent rounded-full"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Social icons - Batch style */}
            <div className="flex items-center space-x-2 ml-3 pl-3 border-l border-border">
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
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-primary rounded-full">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 px-6 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary font-light py-2"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-primary font-light py-2"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary font-light py-2"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link
                        href="/protected"
                        className="text-muted-foreground hover:text-primary font-light py-2"
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
                        className="text-muted-foreground hover:text-primary hover:bg-primary/5 w-fit rounded-full"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="text-muted-foreground hover:text-primary font-light py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/sign-up"
                        className="text-muted-foreground hover:text-primary font-light py-2"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
