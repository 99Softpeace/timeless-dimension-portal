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
  title: "Senator Accessories | Fashion & Lifestyle Store Nigeria",
  description:
    "Bags, clothes, belts, eyeglasses, watches, jewelry, and accessories curated for the Nigerian market.",
  keywords:
    "bags, clothes, belts, eyeglasses, accessories, watches, jewelry, Nigeria, Senator Accessories, fashion ecommerce",
  authors: [{ name: "Senator Accessories" }],
  openGraph: {
    title: "Senator Accessories | Fashion & Lifestyle Store Nigeria",
    description:
      "Bags, clothes, belts, eyeglasses, watches, jewelry, and accessories curated for the Nigerian market.",
    type: "website",
    locale: "en_NG",
    siteName: "Senator Accessories",
  },
  twitter: {
    card: "summary_large_image",
    title: "Senator Accessories | Fashion & Lifestyle Store Nigeria",
    description:
      "Bags, clothes, belts, eyeglasses, watches, jewelry, and accessories curated for the Nigerian market.",
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
        className={`${inter.className} bg-white text-midnight antialiased overflow-x-hidden`}
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

        <Toaster />
      </body>
    </html>
  )
}
