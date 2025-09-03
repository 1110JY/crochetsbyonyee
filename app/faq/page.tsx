import { Navigation } from "@/components/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Instagram, CreditCard } from "lucide-react"
import Link from "next/link"

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
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-balance">FAQ</h1>
          </div>
        </section>

        {/* Important Notice - Added more top padding */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-light text-amber-800 mb-4">Important Notice</h2>
                <p className="text-amber-700 leading-relaxed">
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
              <h2 className="text-4xl font-serif font-light text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>

            <Accordion type="single" collapsible className="space-y-16"> {/* Increased space between accordion groups */}
              {/* Product Section */}
              <div className="space-y-6"> {/* Increased space */}
                <h3 className="text-2xl font-serif font-light text-foreground mb-6 flex items-center gap-3">
                  Product Information
                  <Badge variant="secondary">Handmade</Badge>
                </h3>
                
                <AccordionItem value="product-1" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    How are these products made?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    All items are LOVINGLY handmade and are one of a kind. Because of their handmade nature, they are all different and unique and may vary slightly from the photographs. All products are made with 100% Acrylic or Polyester Yarn, embroidery thread, felt for face details and filled with fibre toy stuffing.
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Shipping Section */}
              <div className="space-y-6"> {/* Increased space */}
                <h3 className="text-2xl font-serif font-light text-foreground mb-6 flex items-center gap-3">
                  Shipping & Delivery
                  <Badge variant="outline">Worldwide</Badge>
                </h3>

                <AccordionItem value="shipping-1" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    Where do you ship to?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    I offer worldwide shipping to all countries!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping-2" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    When will my items ship?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    Items listed on this site will be dispatched within <strong>5-7 business days</strong>. If any updates or delays occur, they will be posted on my Instagram stories. For custom orders, I'll message you the estimated dispatch time.
                    <br /><br />
                    <em>Please note: Shipping times do not include processing/dispatch times.</em>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping-3" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    What are the shipping costs?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">UK Shipping</h4>
                        <p>UK Royal Mail Signed For 2nd Class Delivery - <strong>£5.50</strong></p>
                        <p className="text-sm mt-1">This option only covers up to £50 if package is lost. Delivery is usually within 2-3 working days, including Saturdays. If express delivery is required, please contact me for further details.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">International Shipping</h4>
                        <p>Shipping cost will vary by country and weight. All orders outside the UK are sent as International Tracked.</p>
                        <p className="text-sm mt-1">Delivery is usually within 1-6 weeks depending on location and current situations.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping-4" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    Are buyers responsible for import taxes and customs?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    Yes, buyers are responsible for any import taxes or customs that may apply. Crochets By On-Yee is not responsible for delays due to customs.
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Ordering Section */}
              <div className="space-y-6"> {/* Increased space */}
                <h3 className="text-2xl font-serif font-light text-foreground mb-6 flex items-center gap-3">
                  Ordering Process
                  <Badge variant="secondary">Custom Orders</Badge>
                </h3>

                <AccordionItem value="ordering-1" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    How do I place a custom order?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    Message me on Instagram or email to place your custom order. Payment is through an invoice. When contacting me, please specify exactly what you want with pictures and your country. Prices of products vary depending on the size, level of design and the type of product.
                  </AccordionContent>
                </AccordionItem>
              </div>

              {/* Returns Section */}
              <div className="space-y-6"> {/* Increased space */}
                <h3 className="text-2xl font-serif font-light text-foreground mb-6 flex items-center gap-3">
                  Returns & Exchanges
                  <Badge variant="destructive">No Returns</Badge>
                </h3>

                <AccordionItem value="returns-1" className="border border-muted rounded-lg px-6">
                  <AccordionTrigger className="text-lg font-medium py-5"> {/* Added vertical padding */}
                    What is your returns policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed py-6 pb-8">
                    We <strong>DO NOT</strong> accept returns, exchanges, cancellations or edits after order is placed. If item is damaged in transit, please contact immediately so we can evaluate the situation.
                  </AccordionContent>
                </AccordionItem>
              </div>
            </Accordion>
          </div>
        </section>

        {/* Contact & Payment Section - Added more top padding */}
        <section className="pt-20 pb-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-light text-foreground mb-6">Contact & Payment</h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="w-6 h-6 text-primary" />
                    <h3 className="text-2xl font-serif font-light">Get in Touch</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
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
                    <h3 className="text-2xl font-serif font-light">Payment Methods</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
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
          <p className="text-sm text-muted-foreground">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}