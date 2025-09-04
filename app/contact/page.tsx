"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, Mail, MessageCircle, Clock } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("contact_inquiries").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || null,
        message: formData.message,
      })

      if (error) throw error

      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <main>
          {/* Success Hero Section */}
          <section className="relative py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-accent to-secondary">
            <div className="absolute inset-0 bg-black/40"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-6xl md:text-8xl font-serif font-light mb-8 text-balance">Thank You</h1>
              <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto text-pretty font-light">
                Your message has been sent successfully. We'll get back to you within 24 hours.
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent px-12 py-6 text-lg font-light rounded-full"
              >
                Send Another Message
              </Button>
            </div>
          </section>
          
          <footer className="py-8 px-4 text-center">
            <p className="text-sm text-muted-foreground">© 2025 Crochets by On-Yee. All rights reserved.</p>
          </footer>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section with Gradient */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-accent to-secondary">
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-balance">Contact</h1>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-light text-foreground mb-6">Let's Create Together</h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-light mb-4">Email Us</h3>
                <p className="text-muted-foreground">
                  Drop us an email and we'll get back to you as soon as possible.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-light mb-4">Custom Orders</h3>
                <p className="text-muted-foreground">
                  Have a special request? We love bringing unique visions to life.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-serif font-light mb-4">Response Time</h3>
                <p className="text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-light text-foreground mb-6">Send a Message</h2>
              <div className="w-24 h-px bg-primary mx-auto"></div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 border border-muted">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-foreground font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-2"
                    placeholder="Custom order, product inquiry, etc."
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-foreground font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="mt-2"
                    placeholder="Tell us about your project, questions, or how we can help..."
                  />
                </div>

                <div className="text-center pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="px-12 py-6 text-lg rounded-full"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <p className="text-sm text-muted-foreground">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}