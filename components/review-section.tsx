"use client"

import { ReviewDialog } from "./review-dialog"
import { MessageCircle, Star, Users } from "lucide-react"

export function ReviewSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-accent/5 to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-mochiy text-primary mb-4">
              Share Your Experience
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mochiy-p">
              Your feedback helps create better handmade treasures and helps others discover 
              the perfect crochet pieces for their homes and loved ones.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-mochiy text-primary">250+</div>
                <div className="text-sm text-muted-foreground font-mochiy-p">Happy Customers</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-mochiy text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground font-mochiy-p">Average Rating</div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-mochiy text-primary">180+</div>
                <div className="text-sm text-muted-foreground font-mochiy-p">Reviews</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-border/50">
            <h3 className="text-xl font-mochiy text-primary mb-3">
              Love your crochet purchase?
            </h3>
            <p className="text-muted-foreground mb-6 font-mochiy-p">
              We'd love to hear about your experience! Share photos, rate your purchase, 
              and help fellow crochet enthusiasts discover their next favorite piece.
            </p>
            
            <ReviewDialog />
            
            <p className="text-xs text-muted-foreground mt-4 font-mochiy-p">
              All reviews are moderated to ensure quality and authenticity
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
