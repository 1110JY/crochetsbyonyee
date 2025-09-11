"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { Mail, Instagram, CreditCard, ChevronDown, Heart, Globe, Scissors, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// FAQ Item Component
function FAQCard({ question, answer, category }: { question: string; answer: React.ReactNode; category?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`bg-[#fff8fb] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer rounded-xl shadow-sm ${isOpen ? 'shadow-lg -translate-y-1' : 'shadow-[0_2px_6px_rgba(0,0,0,0.05)]'}`}>
      <div className="p-0">
        <div 
          className="p-6 flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg font-semibold text-[#4a2e2e] pr-4 font-mochiy">{question}</h3>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed font-mochiy">
            {answer}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section with Gradient */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-300 via-pink-200 to-purple-300">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <FadeIn delay={0.2} duration={0.8}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mochiy text-balance">FAQ</h1>
            </FadeIn>
          </div>
        </section>

        {/* Important Notice - Redesigned with light, airy style */}
        <FadeIn delay={0.4} duration={0.6}>
          <section className="py-16 px-10 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-orange-50/50 to-pink-50/50 rounded-2xl p-8 shadow-sm border border-orange-100/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-orange-600 text-lg">⚠️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground font-mochiy">Important Notice</h2>
                </div>
                
                <div className="space-y-4 text-gray-700 leading-relaxed font-mochiy">
                  <p>
                    <strong>International & EU Orders:</strong> Please be aware that additional customs and handling fees may be charged at the point of collection as per new sales tax rules to all international orders from the UK.
                  </p>
                  
                  <p>
                    This applies to <strong>all orders commencing July 1st, 2021.</strong> Due to new EU and Brexit regulations, all EU countries and Ireland will now be charged individual rates of sales tax and potentially other customs handling fees.
                  </p>
                  
                  <p className="text-sm text-gray-600 italic mt-6 pt-4 border-t border-orange-100/50">
                    Last updated: July 2021
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* FAQ Content - Added more spacing between sections */}
        <ScrollReveal>
          <section className="py-20 px-10 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-mochiy text-foreground mb-6">Frequently Asked Questions</h2>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>

              <div className="space-y-12">
                {/* Product Information Section */}
                <div>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-mochiy text-foreground">Product Information</h3>
                      <div className="bg-[#ffeef7] text-pink-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                        <div className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-3 h-3 text-pink-600" />
                        </div>
                        Handmade
                      </div>
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-pink-300 to-pink-100"></div>
                  </div>
                  <div className="space-y-4">
                    <FAQCard 
                      question="How are these products made?"
                      answer="All items are LOVINGLY handmade and are one of a kind. Because of their handmade nature, they are all different and unique and may vary slightly from the photographs. All products are made with 100% Acrylic or Polyester Yarn, embroidery thread, felt for face details and filled with fibre toy stuffing."
                    />
                  </div>
                </div>

                {/* Shipping & Delivery Section */}
                <div>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-mochiy text-foreground">Shipping & Delivery</h3>
                      <div className="bg-[#ffeef7] text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                          <Globe className="w-3 h-3 text-blue-600" />
                        </div>
                        Worldwide
                      </div>
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-blue-300 to-blue-100"></div>
                  </div>
                  <div className="space-y-4">
                    <FAQCard 
                      question="Where do you ship to?"
                      answer="I offer worldwide shipping to all countries!"
                    />
                    <FAQCard 
                      question="When will my items ship?"
                      answer={
                        <div>
                          Items listed on this site will be dispatched within <strong>5-7 business days</strong>. If any updates or delays occur, they will be posted on my Instagram stories. For custom orders, I'll message you the estimated dispatch time.
                          <br /><br />
                          <em>Please note: Shipping times do not include processing/dispatch times.</em>
                        </div>
                      }
                    />
                    <FAQCard 
                      question="What are the shipping costs?"
                      answer={
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">UK Shipping</h4>
                            <p>UK Royal Mail Signed For 2nd Class Delivery - <strong>£5.50</strong></p>
                            <p className="text-sm mt-1">This option only covers up to £50 if package is lost. Delivery is usually within 2-3 working days, including Saturdays. If express delivery is required, please contact me for further details.</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">International Shipping</h4>
                            <p>International delivery is £9.50. This is an untracked service but is more affordable for the customer.</p>
                          </div>
                        </div>
                      }
                    />
                    <FAQCard 
                      question="Are buyers responsible for import taxes and customs?"
                      answer="Yes, buyers are responsible for any import taxes or customs that may apply. Crochets By On-Yee is not responsible for delays due to customs."
                    />
                  </div>
                </div>

                {/* Ordering Process Section */}
                <div>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-mochiy text-foreground">Ordering Process</h3>
                      <div className="bg-[#ffeef7] text-green-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <Scissors className="w-3 h-3 text-green-600" />
                        </div>
                        Custom Orders
                      </div>
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-green-300 to-green-100"></div>
                  </div>
                  <div className="space-y-4">
                    <FAQCard 
                      question="How do I place a custom order?"
                      answer="Message me on Instagram or email to place your custom order. Payment is through an invoice. When contacting me, please specify exactly what you want with pictures and your country. Prices of products vary depending on the size, level of design and the type of product."
                    />
                  </div>
                </div>

                {/* Returns & Exchanges Section */}
                <div>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-mochiy text-foreground">Returns & Exchanges</h3>
                      <div className="bg-[#ffeef7] text-red-600 px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                          <X className="w-3 h-3 text-red-600" />
                        </div>
                        No Returns
                      </div>
                    </div>
                    <div className="w-16 h-0.5 bg-gradient-to-r from-red-300 to-red-100"></div>
                  </div>
                  <div className="space-y-4">
                    <FAQCard 
                      question="What is your returns policy?"
                      answer={
                        <div>
                          We <strong>DO NOT</strong> accept returns, exchanges, cancellations or edits after order is placed. If item is damaged in transit, please contact immediately so we can evaluate the situation.
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Contact & Payment Section - Redesigned */}
        <ScrollReveal>
          <section className="pt-20 pb-20 px-10 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-mochiy text-foreground mb-6">Contact & Payment</h2>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact - Redesigned */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-primary/20 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-mochiy text-foreground">Get in Touch</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-8 font-mochiy text-base sm:text-lg">
                    Messages and emails are checked regularly and queries will be answered promptly.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-primary/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Instagram</div>
                        <div className="text-sm text-muted-foreground">Message me on Instagram</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-primary/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <Link 
                          href="mailto:crochetsbyonyee@gmail.com" 
                          className="text-primary hover:text-primary/80 transition-colors text-sm"
                        >
                          crochetsbyonyee@gmail.com
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment - Redesigned */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-primary/20 hover:border-primary/30 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-mochiy text-foreground">Payment Methods</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-8 font-mochiy text-base sm:text-lg">
                    We accept the following payment methods for your convenience:
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="w-12 h-8 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Credit / Debit Cards</div>
                        <div className="text-sm text-muted-foreground">Visa, Mastercard, American Express</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="w-12 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-xs font-bold text-blue-600">
                        PP
                      </div>
                      <div>
                        <div className="font-medium text-foreground">PayPal</div>
                        <div className="text-sm text-muted-foreground">Secure online payments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Footer - Added more top padding */}
        <footer className="pt-12 pb-8 px-4 text-center">
          <p className="text-sm text-muted-foreground font-mochiy">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
