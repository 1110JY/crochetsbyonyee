import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import Link from "next/link"

export default function AboutPage() {
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
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-mochiy font-light text-balance">About</h1>
            </FadeIn>
          </div>
        </section>

        {/* Story Section */}
        <FadeIn delay={0.4} duration={0.6}>
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-mochiy font-light text-foreground mb-6">Our Story</h2>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>
              
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed font-mochiy-p">
                <p className="text-xl mb-8 font-mochiy-p">
                  What started as a personal passion for creating kawaii and adorable crochet pieces has blossomed into 
                  Crochets by On-Yee, where every stitch is infused with love and meticulous attention to detail.
                </p>
                
                <p className="mb-8 font-mochiy-p">
                  Our journey began with a simple belief: that handmade items carry a special warmth and character that 
                  mass-produced goods simply cannot match. Each piece we create is a labor of love, carefully crafted using 
                  premium yarns and time-honored techniques passed down through generations.
                </p>
                
                <p className="mb-8 font-mochiy-p">
                  From whimsical amigurumi characters to cozy blankets and stylish accessories, we specialise in creating 
                  pieces that bring joy to everyday life. Our kawaii-inspired designs celebrate the beauty of simplicity 
                  and the charm of handcrafted artistry.
                </p>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Values Section */}
        <FadeIn delay={0.6} duration={0.6}>
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-mochiy text-foreground mb-6">What We Believe</h2>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                  </div>
                  <h3 className="text-2xl font-mochiy mb-4">Quality Craftsmanship</h3>
                  <p className="text-muted-foreground leading-relaxed font-mochiy-p">
                    Every piece is meticulously handcrafted using premium materials and techniques refined over years of practice. 
                    We never compromise on quality.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                  </div>
                  <h3 className="text-2xl font-mochiy mb-4">Sustainable Practice</h3>
                  <p className="text-muted-foreground leading-relaxed font-mochiy-p">
                    We source our materials responsibly and create items designed to last for generations, reducing waste 
                    and promoting sustainable living.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 bg-primary rounded-full"></div>
                  </div>
                  <h3 className="text-2xl font-mochiy mb-4">Personal Touch</h3>
                  <p className="text-muted-foreground leading-relaxed font-mochiy-p">
                    Each creation carries the warmth of human hands and the care of personal attention. We believe in the 
                    power of handmade to create meaningful connections.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Process Section */}
        <FadeIn delay={0.8} duration={0.6}>
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-mochiy text-foreground mb-6">Our Process</h2>
                <div className="w-24 h-px bg-primary mx-auto"></div>
              </div>
              
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-6xl font-mochiy text-primary">1</span>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-mochiy mb-4">Design & Planning</h3>
                    <p className="text-muted-foreground leading-relaxed font-mochiy-p">
                      Every project begins with careful planning and design consideration. We sketch patterns, select 
                      color palettes, and choose the perfect materials to bring each vision to life.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-6xl font-mochiy text-primary">2</span>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-mochiy mb-4">Handcrafting</h3>
                    <p className="text-muted-foreground leading-relaxed font-mochiy-p">
                      With patience and precision, we bring each design to life stitch by stitch. Our hands work 
                      magic with hook and yarn, creating textures and forms that delight the senses.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-6xl font-mochiy text-primary">3</span>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-2xl font-mochiy mb-4">Quality Assurance</h3>
                    <p className="text-muted-foreground leading-relaxed font-mochiy-p">
                      Before each piece finds its new home, we carefully inspect every detail to ensure it meets our 
                      high standards for durability, beauty, and craftsmanship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Call to Action */}
        <FadeIn delay={1.0} duration={0.6}>
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl font-mochiy text-foreground mb-8">Ready to Find Your Perfect Piece?</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto font-mochiy-p">
                Explore our collection of handmade treasures, or get in touch to discuss a custom creation made just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="px-12 rounded-full min-w-[180px]"
                >
                  <Link href="/products">Browse Collection</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent px-12 rounded-full min-w-[180px]"
                >
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </section>
        </FadeIn>

        {/* Footer */}
        <footer className="py-8 px-4 text-center">
          <p className="text-sm text-muted-foreground font-nunito">© 2025 Crochets by On-Yee. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}