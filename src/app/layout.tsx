import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { CartProvider } from "@/components/CartContext"
import { AuthProvider } from "@/context/AuthContext"
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
  title: "Senator Watches | Luxury Timepieces Nigeria",
  description:
    "Fragments of forever — luxury wristwatches crafted for the Nigerian market. Experience time in a new dimension with the Senator Collection.",
  keywords:
    "luxury watches, Nigeria, Senator watches, wristwatches, mechanical watches, hybrid watches, 3D models, ecommerce",
  authors: [{ name: "Senator Watches" }],
  openGraph: {
    title: "Senator Watches | Luxury Timepieces Nigeria",
    description:
      "Fragments of forever — luxury wristwatches crafted for the Nigerian market.",
    type: "website",
    locale: "en_NG",
    siteName: "Senator Watches",
  },
  twitter: {
    card: "summary_large_image",
    title: "Senator Watches | Luxury Timepieces Nigeria",
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
        className={`${inter.className} bg-[#F5F5F7] text-midnight antialiased`}
      >
        <CartProvider>
          <AuthProvider>
            <div className="min-h-screen hero-bg flex flex-col">
              <Header />
              <main className="flex-1 relative">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </CartProvider>

        {/* Toaster lives outside so it can overlay everything */}
        <Toaster />
      </body>
    </html>
  )
}
