import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-accent to-secondary relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <Link 
              href="/" 
              className="text-4xl md:text-6xl font-mochiy text-white hover:text-white/80 transition-colors"
            >
              Crochets by On-Yee
            </Link>
            <div className="w-24 h-px bg-white/30 mx-auto mt-4"></div>
          </div>

          {/* Success Card */}
          <Card className="border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-mochiy text-white mb-2">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="text-white/70 text-lg font-nunito">
                Check your email to confirm
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <p className="text-white/90 font-nunito text-center leading-relaxed">
                You&apos;ve successfully signed up. Please check your email to confirm your account before signing in.
              </p>
              
              <div className="text-center pt-6">
                <Link 
                  href="/auth/login" 
                  className="text-white hover:text-white/80 underline underline-offset-4 font-nunito transition-colors"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Back to home */}
          <div className="text-center mt-8">
            <Link 
              href="/" 
              className="text-white/60 hover:text-white/80 text-sm font-nunito transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
