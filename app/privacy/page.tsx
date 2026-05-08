"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, RefreshCw, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/shared/ContactForm";

export default function PrivacyPolicyPage() {
  const lastUpdated = "May 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Eye,
      content: "We only collect data necessary to provide personalized career trajectories and academic analysis. This includes information you explicitly enter into our onboarding questionnaire (e.g., current education level, target career pivot, verified skills, and interest keywords). We do not collect or harvest any background system information.",
    },
    {
      title: "2. How We Use Your Data",
      icon: Shield,
      content: "Your data is used solely to power our dynamic Retrieval-Augmented Generation (RAG) career advisor, ATS scanner, and curriculum optimizer. If you are using Forfwd in Guest Mode, your responses reside entirely inside client-side temporary state (Zustand) and are not saved to any database. For logged-in users, data is securely stored inside an encrypted Neon PostgreSQL database.",
    },
    {
      title: "3. Third-Party API Processing",
      icon: Lock,
      content: "To generate your high-fidelity career trajectories, we safely pass anonymized questionnaire metrics to the Google Gemini API. This data transmission is governed by strict enterprise privacy agreements: Google does not use our user inputs to train or refine their public foundational LLMs.",
    },
    {
      title: "4. Student Data Privacy Commitments",
      icon: FileText,
      content: "As an academic career platform, we are committed to absolute educational privacy. We do not sell, rent, or lease any student profile metrics to corporate recruiting agencies, marketing networks, or third-party brokers. Your career trajectory is yours alone.",
    },
    {
      title: "5. Data Retention & Erasure",
      icon: RefreshCw,
      content: "You maintain complete ownership of your data. You can completely wipe your search history, generated dashboards, and user sessions instantly from your settings console. Guest data is cleared automatically upon browser session termination.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #4f46e5 0, transparent 40%), radial-gradient(circle at 20% 80%, #10b981 0, transparent 40%)' }} />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/92 dark:bg-[#080808]/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <img src="/banner.png" alt="Forfwd" className="h-15 w-auto object-contain block dark:hidden transition-transform group-hover:scale-[1.02]" />
            <img src="/banner-dark.png" alt="Forfwd" className="h-15 w-auto object-contain hidden dark:block transition-transform group-hover:scale-[1.02]" />
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            Trust & Security
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-12">
            Last updated: {lastUpdated} &bull; We believe your career data is private. Here is how we protect it.
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
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
