"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Cpu, Globe, Compass, Sparkles, Code, Terminal, Server } from "lucide-react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/shared/ContactForm";

export default function DocumentationPage() {
  const chapters = [
    {
      title: "1. Retrieval-Augmented Generation (RAG)",
      icon: Cpu,
      badge: "Core AI",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      content: "Forfwd uses a highly optimized, multi-agent RAG pipeline rather than relying on static pre-trained weights. When you enter a career or academic question, Forfwd dynamically synthesizes search queries, scrapes live job markets and university criteria via federated SearXNG containers, cleans raw HTML contexts, and feeds validated contexts into Google Gemini 1.5 Flash inside deterministic Zod schemas.",
    },
    {
      title: "2. Real-Time Web Synthesis (SearXNG)",
      icon: Globe,
      badge: "Scraping Layer",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      content: "SearXNG serves as Forfwd's distributed retrieval search gateway. Running in a sandboxed docker container, it queries up to 10 endpoints concurrently. This parallel execution minimizes latency and completely avoids search rate-limits, providing live, halluncination-free data sources (degree costs, market demand, hiring trends) within milliseconds.",
    },
    {
      title: "3. Interactive Physics Orbit Map",
      icon: Compass,
      badge: "Visualizer",
      color: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20",
      content: "Our signature 'VisualExplorer' utilizes custom HTML5 canvas node layouts to represent alternative career trajectories and educational requirements. Each path is mapped as an orbit around a student's core specialty, featuring realistic hover-reactive animations, friction physics, and dynamic connection lines.",
    },
    {
      title: "4. ATS Resume Optimization",
      icon: Sparkles,
      badge: "ATS Scanner",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      content: "Our ATS Engine parses resume contents and checks them against live job postings to identify critical skill gaps. Our AI-driven resume rewriter suggests seamless contextual integrations of these missing entities without disrupting the original tone, providing an interactive split-screen diff viewer for simple code copy-paste.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 10%, #6366f1 0, transparent 40%), radial-gradient(circle at 10% 90%, #10b981 0, transparent 40%)' }} />

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
      <main className="mx-auto max-w-[1000px] px-6 py-16 md:py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Technical Guide & Architecture
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Platform Documentation</h1>
            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
              Understand the advanced Retrieval-Augmented Generation models, federated crawlers, and physics maps powering Forfwd.
            </p>
          </div>

          {/* Quickstart Code Block */}
          <div className="mb-16 p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-900 dark:bg-[#0c0c0c] text-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-widest text-zinc-400">
              <Terminal className="w-3 h-3" /> Quickstart
            </div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-wider mb-4">
              <Code className="w-4 h-4" /> Local Setup Commands
            </div>
            <pre className="text-xs md:text-sm font-mono leading-relaxed overflow-x-auto text-slate-300">
              <code>{`# 1. Spin up the sandboxed local SearXNG container
docker compose up -d

# 2. Install all core packages & dependencies
npm install

# 3. Fire up the high-performance Next.js dev server
npm run dev`}</code>
            </pre>
          </div>

          {/* Chapters Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {chapters.map((chapter, idx) => {
              const Icon = chapter.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] shadow-sm hover:border-slate-300 dark:hover:border-white/10 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border ${chapter.color}`}>
                      {chapter.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight leading-snug">{chapter.title}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-zinc-400 text-sm font-normal leading-relaxed">
                    {chapter.content}
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
