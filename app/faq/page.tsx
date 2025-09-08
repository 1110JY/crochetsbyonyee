"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Instagram, CreditCard, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// FAQ Item Component
function FAQCard({ question, answer, category }: { question: string; answer: React.ReactNode; category?: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className={`bg-white border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${isOpen ? 'shadow-lg border-primary' : 'border-accent hover:border-primary'}`}>
      <CardContent className="p-0">
        <div 
          className="p-6 flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-lg font-mochiy text-foreground pr-4">{question}</h3>
          <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 pb-6 text-muted-foreground leading-relaxed font-mochiy-p">
            {answer}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section with Gradient */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-accent to-secondary">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mochiy text-balance">FAQ</h1>
          </div>
        </section>

        {/* Important Notice - Added more top padding */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-mochiy text-amber-800 mb-4">Important Notice</h2>
                <p className="text-amber-700 leading-relaxed font-mochiy-p">
                  <strong>International & EU Orders:</strong> Please be aware that additional customs and handling fees may be charged at the point of collection as per new sales tax rules to all international orders from the UK, commencing July 1st 2021. Due to new EU and Brexit regulations, all EU countries and Ireland will now be charged on individual rate of sales tax and potentially other customs handling fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Content - Added more spacing between sections */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mochiy text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>

            <div className="space-y-12">
              {/* Product Information Section */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="text-2xl font-mochiy text-foreground">Product Information</h3>
                  <Badge variant="secondary">Handmade</Badge>
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
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="text-2xl font-mochiy text-foreground">Shipping & Delivery</h3>
                  <Badge variant="outline">Worldwide</Badge>
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
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="text-2xl font-mochiy text-foreground">Ordering Process</h3>
                  <Badge variant="secondary">Custom Orders</Badge>
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
                <div className="flex items-center gap-3 mb-8">
                  <h3 className="text-2xl font-mochiy text-foreground">Returns & Exchanges</h3>
                  <Badge variant="destructive">No Returns</Badge>
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

        {/* Contact & Payment Section - Added more top padding */}
        <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-mochiy text-foreground mb-6">Contact & Payment</h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-mochiy">Get in Touch</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 font-mochiy-p">
                    Messages and emails are checked regularly and queries will be answered promptly.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-primary" />
                      <span>Message me on Instagram</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <Link 
                        href="mailto:crochetsbyonyee@gmail.com" 
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        crochetsbyonyee@gmail.com
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-mochiy">Payment Methods</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 font-mochiy-p">
                    We accept the following payment methods for your convenience:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-primary/20 rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                      <span>Credit / Debit Cards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                        PP
                      </div>
                      <span>PayPal</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer - Added more top padding */}
        <footer className="pt-12 pb-8 px-4 text-center">
          <p className="text-sm text-muted-foreground font-nunito">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}
