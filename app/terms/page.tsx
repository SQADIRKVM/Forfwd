"use client";

import Link from "next/link";
import { ArrowLeft, Scale, CheckCircle, HelpCircle, AlertTriangle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/shared/ContactForm";

export default function TermsOfServicePage() {
  const lastUpdated = "May 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: CheckCircle,
      content: "By accessing or using the Forfwd platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the service. These terms apply to all visitors, registered students, and corporate partners.",
    },
    {
      title: "2. Permitted Use of AI Services",
      icon: Scale,
      content: "Forfwd provides a retrieval-augmented artificial intelligence platform. You are permitted to use generated career dashboards, ATS optimization results, and academic pathway suggestions for personal development, academic research, and job applications. Commercial redistribution of generated roadmaps is prohibited.",
    },
    {
      title: "3. Disclaimers: AI & Live Verification",
      icon: AlertTriangle,
      content: "While Forfwd uses advanced SearXNG verification containers and Google Gemini 1.5 models to dramatically reduce errors, all career trajectories, cost-of-living indices, and course suggestions are provided 'as is' for informational purposes. Users are advised to manually cross-reference official university directories and job boards before making financial or career commitments.",
    },
    {
      title: "4. System Usage Limits & Security",
      icon: AlertCircle,
      content: "To protect our federated containers, we enforce soft rate-limits on our AI generation APIs. You agree not to abuse, crawl, scrape, or flood our endpoints (such as /api/generate-dashboard) using automated scripts or bulk request engines.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #4f46e5 0, transparent 40%), radial-gradient(circle at 90% 80%, #3b82f6 0, transparent 40%)' }} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/92 dark:bg-[#080808]/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <img src="/banner.png" alt="Forfwd" className="h-15 w-auto object-contain transition-transform group-hover:scale-[1.02]" />
          </Link>
          <Link href="/" className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 transition-colors hover:text-slate-800 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[800px] px-6 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6 text-xs font-semibold text-blue-600 dark:text-blue-400">
            Legal Terms
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Terms of Service</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-12">
            Last updated: {lastUpdated} &bull; Please review our terms of use before generating dashboards.
          </p>

          <div className="space-y-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-505/10 text-blue-600 dark:text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight">{section.title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 text-sm md:text-base font-normal leading-relaxed pl-13">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Contact Section */}
          <div className="mt-16">
            <ContactForm />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
