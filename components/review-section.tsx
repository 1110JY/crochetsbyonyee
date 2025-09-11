"use client"

import { ReviewDialog } from "./review-dialog"
import { MessageCircle, Star, Users } from "lucide-react"

export function ReviewSection() {
  return (
    <section className="py-16 px-10 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          {/* Header */}
          <div className="mb-16">
            <h2 className="text-3xl sm:text-4xl font-mochiy text-foreground mb-6">
              Share Your Experience
            </h2>
            <div className="w-24 h-px bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-mochiy-p">
              Your feedback helps create better handmade treasures and helps others discover 
              the perfect crochet pieces for their homes and loved ones.
            </p>
          </div>

          {/* Stats - Redesigned for better mobile layout */}
          <div className="grid grid-cols-1 gap-6 mb-16 max-w-md mx-auto sm:max-w-none sm:grid-cols-3 sm:gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-4 sm:flex-col sm:gap-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center sm:mx-auto sm:mb-4 flex-shrink-0">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 sm:text-center">
                  <div className="text-2xl sm:text-3xl font-mochiy text-primary">250+</div>
                  <div className="text-sm text-muted-foreground font-mochiy">Happy Customers</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-4 sm:flex-col sm:gap-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center sm:mx-auto sm:mb-4 flex-shrink-0">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 sm:text-center">
                  <div className="text-2xl sm:text-3xl font-mochiy text-primary">4.9/5</div>
                  <div className="text-sm text-muted-foreground font-mochiy">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-primary/10 hover:border-primary/20 transition-all duration-300">
              <div className="flex items-center gap-4 sm:flex-col sm:gap-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center sm:mx-auto sm:mb-4 flex-shrink-0">
                  <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <div className="flex-1 sm:text-center">
                  <div className="text-2xl sm:text-3xl font-mochiy text-primary">180+</div>
                  <div className="text-sm text-muted-foreground font-mochiy">Reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action - Redesigned */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 sm:p-10 border border-primary/20 hover:border-primary/30 transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-mochiy text-primary mb-4">
              Love your crochet purchase?
            </h3>
            <p className="text-muted-foreground mb-8 font-mochiy-p text-base sm:text-lg leading-relaxed">
              We'd love to hear about your experience! Share photos, rate your purchase, 
              and help fellow crochet enthusiasts discover their next favorite piece.
            </p>
            
            <ReviewDialog />
            
            <p className="text-xs text-muted-foreground mt-6 font-mochiy-p">
              All reviews are moderated to ensure quality and authenticity
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
