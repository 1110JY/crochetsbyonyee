import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { Source_Sans_3 } from "next/font/google"
import { DM_Serif_Display } from "next/font/google"
import { Bree_Serif } from "next/font/google"
import { Mochiy_Pop_One } from "next/font/google"
import { Mochiy_Pop_P_One } from "next/font/google"
import { Fredoka } from "next/font/google"
import { Nunito } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { CurrencyProvider } from "@/contexts/currency-context"
import { ConditionalAnnouncementBar } from "../components/conditional-announcement-bar"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
})

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-dm-serif",
})

const breeSerif = Bree_Serif({
  subsets: ["latin"],
  weight: "400", 
  display: "swap",
  variable: "--font-bree-serif",
})

const mochiyPop = Mochiy_Pop_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-mochiy-pop",
})

const mochiyPopP = Mochiy_Pop_P_One({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-mochiy-pop-p",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-fredoka",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: "300",
  display: "swap",
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Crochets by On-Yee - Handmade Kawaii Crochets",
  description:
    "Beautiful handmade crochet items crafted with love and attention to detail.",
  icons: {
    icon: [
      { url: "/Favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Mochiy+Pop+P+One&family=Fredoka:wght@400&family=Nunito:wght@300&display=swap" rel="stylesheet" />
      </head>
      <body 
        className={`${playfair.variable} ${sourceSans.variable} ${dmSerif.variable} ${breeSerif.variable} ${mochiyPop.variable} ${mochiyPopP.variable} ${fredoka.variable} ${nunito.variable} ${GeistMono.variable} pb-12`}
        suppressHydrationWarning
      >
        <CurrencyProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <ConditionalAnnouncementBar />
          <Toaster />
        </CurrencyProvider>
        <Analytics />
      </body>
    </html>
  )
}