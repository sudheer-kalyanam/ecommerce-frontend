import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MarketPlace - Multi-Vendor eCommerce Platform",
  description: "Discover amazing products from trusted sellers worldwide. Shop with confidence on our secure multi-vendor marketplace.",
  keywords: "ecommerce, marketplace, multi-vendor, online shopping, products",
  authors: [{ name: "YERNAGULA SIDDARTHA" }],
  openGraph: {
    title: "MarketPlace - Multi-Vendor eCommerce Platform",
    description: "Discover amazing products from trusted sellers worldwide",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            <Header />
            <main className="pt-20">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}