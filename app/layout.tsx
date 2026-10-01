import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/context/AuthContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pathan Tutorials — Expert Mathematics Coaching in Hinganghat",
  description:
    "Premier mathematics coaching for 8th–12th CBSE & Maharashtra State Board, and MHT-CET preparation in Hinganghat. Join 500+ successful students.",
  keywords: "Pathan Tutorials, mathematics coaching, Hinganghat, CBSE, Maharashtra Board, MHT-CET, 10th maths, 12th maths",
  icons: {
    icon: "/logo-favicon.png",
  },
  openGraph: {
    title: "Pathan Tutorials — Mathematics Coaching Hinganghat",
    description: "Expert mathematics coaching for class 8 to 12 and MHT-CET. Located in Hinganghat, Maharashtra.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-dark text-white">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#111111",
                color: "#ffffff",
                border: "1px solid #2a2a2a",
                fontSize: "0.875rem",
              },
              success: {
                iconTheme: { primary: "#eab308", secondary: "#000" },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
