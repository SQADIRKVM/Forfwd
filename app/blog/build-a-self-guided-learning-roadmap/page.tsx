"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Map, Target, Layers } from "lucide-react";
import { motion } from "framer-motion";

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Build Your Own Learning Roadmap for High-Growth Tech Careers",
  "description": "You don't need a top university degree to break into tech in 2026. What you need is a clear, structured self-guided learning roadmap — and the discipline to follow it.",
  "datePublished": "2026-05-06",
  "dateModified": "2026-05-06",
  "author": { "@type": "Organization", "name": "Forfwd", "url": "https://forfwd.tech" },
  "publisher": { "@type": "Organization", "name": "Forfwd", "logo": { "@type": "ImageObject", "url": "https://forfwd.tech/banner.png" } },
  "url": "https://forfwd.tech/blog/build-a-self-guided-learning-roadmap",
  "mainEntityOfPage": "https://forfwd.tech/blog/build-a-self-guided-learning-roadmap",
  "keywords": ["learning roadmap", "self-guided learning", "tech career", "career roadmap 2026", "skill acquisition", "AI career guidance"]
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://forfwd.tech" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://forfwd.tech/blog" },
    { "@type": "ListItem", "position": 3, "name": "How to Build Your Own Learning Roadmap for High-Growth Tech Careers", "item": "https://forfwd.tech/blog/build-a-self-guided-learning-roadmap" }
  ]
};

export default function LearningRoadmapPost() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 75% 10%, #f59e0b 0, transparent 50%), radial-gradient(circle at 10% 90%, #d97706 0, transparent 40%)",
        }}
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/92 dark:bg-[#080808]/92 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <img src="/banner.png" alt="Forfwd" className="h-15 w-auto object-contain block dark:hidden transition-transform group-hover:scale-[1.02]" />
            <img src="/banner-dark.png" alt="Forfwd" className="h-15 w-auto object-contain hidden dark:block transition-transform group-hover:scale-[1.02]" />
          </Link>
          <Link href="/blog" className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 transition-colors hover:text-slate-800 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-[780px] px-6 py-16 md:py-24 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Article Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20">
                Learning Paths
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Calendar className="h-3 w-3" /> May 6, 2026
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Clock className="h-3 w-3" /> 7 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              How to Build Your Own Learning Roadmap for High-Growth Tech Careers
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-xl leading-relaxed font-normal">
              You don't need a degree from a top university to break into tech in 2026. What you need is a clear, structured self-guided learning roadmap — and the discipline to follow it. Here's how to build one from scratch.
            </p>
          </div>

          {/* Article Body */}
          <div className="space-y-8">

            <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">The Problem with Generic Roadmaps</p>
              <p className="text-slate-700 dark:text-zinc-300 text-base leading-relaxed m-0">
                Generic learning roadmaps found on Reddit and YouTube are useful starting points — but they're built for an imaginary average person. You're not average. Your background, schedule, goals, and existing knowledge all change what the fastest path forward actually looks like for you.
              </p>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Phase 1: Define Your Target Role First (Not Your Interests)</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                The most common mistake self-learners make is starting with "what looks interesting to learn" instead of "what gets me hired." These two things are often very different.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Before you open a single tutorial, pick a specific target role. Not "I want to work in tech" — something granular:
              </p>
              <div className="mt-4 grid gap-2">
                {[
                  "Junior Frontend Developer at a SaaS startup",
                  "Entry-Level Data Analyst at a mid-size e-commerce company",
                  "Associate Product Manager at a fintech firm",
                  "Junior UX Designer at a healthcare technology company",
                ].map((role, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-white dark:bg-[#0f0f0f]">
                    <span className="text-amber-500 font-black text-sm">→</span>
                    <span className="text-slate-700 dark:text-zinc-300 text-sm">{role}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mt-4">
                Once you have a specific target, go to LinkedIn Jobs or Indeed and read 15–20 real job postings for that role. Write down every skill, tool, and qualification that appears more than 3 times. That list <strong className="text-slate-800 dark:text-zinc-100">is your roadmap</strong>.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Phase 2: Structure Your Learning Into Sprints</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Random learning doesn't work. Watching 300 hours of YouTube tutorials doesn't work. What works is structured, time-boxed learning sprints where each sprint ends with a tangible deliverable.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Use a 4-week sprint structure:
              </p>
              <div className="grid gap-4 mt-4">
                {[
                  { week: "Weeks 1–2", title: "Core Concept Deep Dive", desc: "Focus on learning the foundational theory and syntax of one skill from your job requirement list. Use structured courses (Coursera, freeCodeCamp, official documentation) — not random YouTube. Take notes and practice daily." },
                  { week: "Week 3", title: "Build Something Real", desc: "Apply what you learned by building a small but complete project. Not a tutorial clone — something you designed from scratch. Even a simple one counts: a weather app, a budget tracker, a personal portfolio." },
                  { week: "Week 4", title: "Ship, Document & Reflect", desc: "Deploy your project publicly (GitHub Pages, Vercel, Netlify). Write a README explaining what you built and why. Then evaluate: what did you learn? What's still confusing? What's the next sprint skill?" },
                ].map((item) => (
                  <div key={item.week} className="p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">{item.week}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">{item.title}</span>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Map className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Phase 3: Build a Portfolio That Proves You Can Do the Job</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                After 4–6 sprints (roughly 4–6 months at a steady pace), you'll have 4–6 portfolio projects. Here's the key insight most self-learners miss: <strong className="text-slate-800 dark:text-zinc-100">your portfolio is not a collection of projects — it's a proof-of-work document.</strong>
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Each project should demonstrate a specific skill from your target job postings. If the job requires SQL and Python, one of your projects should use both together — not separately in different tutorials. Relevance is everything.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                At this point, you have something most bootcamp graduates don't: a portfolio built around a specific, research-backed job target. Start applying. You won't get every role — but you'll get interviews, and interviews are where you learn what to improve next.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">The Honest Timeline</h2>
              <div className="grid gap-3">
                {[
                  { label: "Switching from 0 experience to Junior Dev", time: "8–14 months (20 hrs/week)" },
                  { label: "Pivoting from a adjacent field (e.g., design → UX)", time: "4–6 months (15 hrs/week)" },
                  { label: "Upskilling within your current role", time: "2–4 months (8 hrs/week)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f]">
                    <span className="text-slate-700 dark:text-zinc-300 text-sm font-medium">{item.label}</span>
                    <span className="text-amber-600 dark:text-amber-400 text-sm font-black shrink-0 ml-4">{item.time}</span>
                  </div>
                ))}
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mt-4 text-sm">
                These timelines assume consistent, focused effort — not passive consumption. Watching tutorials every day is not the same as practicing and building every day.
              </p>
            </section>

            {/* CTA */}
            <div className="mt-10 p-7 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5 text-center">
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mb-2">Get your personalized learning roadmap</p>
              <p className="text-slate-600 dark:text-zinc-400 text-sm mb-5">Forfwd builds you a custom, step-by-step skill acquisition plan based on your specific background and target role — powered by live job market data, not generic advice.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold transition-colors">
                Build My Roadmap Free <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
