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
  title: "CareerX Institute",
  description: "Next-generation academic and career guidance platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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
