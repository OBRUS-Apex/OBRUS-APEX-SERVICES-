import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OBRUS APEX SERVICES | Partner in Excellence, Safety, & Operational Efficiency",
  // Updated to client's requested SEO Meta Description
  description: "Obrus Apex Services provides expert facility management, HSE compliance, manpower deployment, and equipment procurement solutions to help your business operate safely and efficiently.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${cormorant.variable} ${jost.variable} font-sans antialiased bg-[#f5f0e8] text-[#0b1f3a]`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#0b1f3a',
              color: '#ffffff',
              border: '1px solid rgba(200, 146, 30, 0.3)',
              fontSize: '14px',
              fontFamily: 'Jost, sans-serif',
              borderRadius: '12px',
              padding: '12px 20px',
            },
            success: {
              iconTheme: { primary: '#c8921e', secondary: '#0b1f3a' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
