import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/components/CartContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Timeless Dimension Portal | Luxury Watches Nigeria",
  description:
    "Fragments of forever — luxury wristwatches crafted for the Nigerian market. Experience time in a new dimension with our curated collection of mechanical and hybrid timepieces.",
  keywords:
    "luxury watches, Nigeria, wristwatches, mechanical watches, hybrid watches, 3D models, ecommerce",
  authors: [{ name: "Timeless Dimension Portal" }],
  openGraph: {
    title: "Timeless Dimension Portal | Luxury Watches Nigeria",
    description:
      "Fragments of forever — luxury wristwatches crafted for the Nigerian market.",
    type: "website",
    locale: "en_NG",
    siteName: "Timeless Dimension Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Timeless Dimension Portal | Luxury Watches Nigeria",
    description:
      "Fragments of forever — luxury wristwatches crafted for the Nigerian market.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body
        className={`${inter.className} bg-midnight-2 text-silver antialiased`}
      >
        <CartProvider>
          <div className="min-h-screen hero-bg flex flex-col">
            <Header />
            <main className="flex-1 relative">{children}</main>
            <Footer />
          </div>
        </CartProvider>

        {/* Toaster lives outside so it can overlay everything */}
        <Toaster />
      </body>
    </html>
  )
}
