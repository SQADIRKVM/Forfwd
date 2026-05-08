import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/shared/SmoothScroll";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://forfwd.com'),
  alternates: {
    canonical: '/',
  },
  title: "Forfwd — Move forward. Plan better.",
  description: "Next-generation academic and career guidance platform leveraging Retrieval-Augmented Generation (RAG) to build personalized, real-time trajectories based on live job market and university data.",
  keywords: [
    "AI Career Advisor",
    "Retrieval-Augmented Generation RAG",
    "Career Roadmaps",
    "ATS Resume Scanner",
    "Skill Gap Analysis",
    "AI Learning Trajectories",
    "University Degree Navigator",
    "Course Progress Tracker",
    "Career Pivot Simulator",
    "Forfwd",
    "Interactive Orbit Map",
    "Forfwd Career",
    "Self-Guided Learning Roadmap"
  ],
  openGraph: {
    title: "Forfwd — Move forward. Plan better.",
    description: "Next-generation academic and career guidance platform leveraging Retrieval-Augmented Generation (RAG) to build personalized, real-time trajectories based on live job market and university data.",
    url: "https://forfwd.com",
    siteName: "Forfwd",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Forfwd Career Discovery Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forfwd — Move forward. Plan better.",
    description: "Next-generation academic and career guidance platform leveraging Retrieval-Augmented Generation (RAG) to build personalized, real-time trajectories based on live job market and university data.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Forfwd",
              "url": "https://forfwd.com",
              "logo": "https://forfwd.com/logo.png",
              "description": "Next-generation academic and career guidance platform leveraging Retrieval-Augmented Generation (RAG) to build personalized, real-time trajectories.",
              "applicationCategory": "EducationalApplication, BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0.00",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Real-Time Market RAG Analysis",
                "Interactive Orbit Trajectory Map",
                "AI Career Advisory Concierge",
                "ATS Compatibility Resume Scanner"
              ]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <ThemeProvider>
          {/* Dark mode ambient glow — only visible in dark mode, matches landing page aesthetic */}
          <div className="hidden dark:block fixed inset-0 z-0 pointer-events-none" aria-hidden>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
          </div>
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast: "rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 shadow-xl",
                description: "text-slate-500 dark:text-zinc-400",
                actionButton: "bg-indigo-600 text-white",
                cancelButton: "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400",
                error: "border-rose-200 dark:border-rose-500/20",
                success: "border-emerald-200 dark:border-emerald-500/20",
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
