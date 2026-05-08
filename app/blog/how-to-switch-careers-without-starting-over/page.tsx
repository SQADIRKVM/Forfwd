"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Zap, BookOpen, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

// ─── Per-Page SEO Metadata ────────────────────────────────────────────────────
// Note: metadata export must be in a Server Component. Move to a parent layout
// or use generateMetadata in a server wrapper if needed.
// For now, the global layout.tsx covers the baseline; article schemas are injected inline.

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Switch Careers Without Starting Over",
  "description": "Thinking about changing careers but terrified of losing everything you've built? Here's how to transfer your existing skills into a completely new field — without going back to square one.",
  "datePublished": "2026-05-08",
  "dateModified": "2026-05-08",
  "author": { "@type": "Organization", "name": "Forfwd", "url": "https://forfwd.tech" },
  "publisher": { "@type": "Organization", "name": "Forfwd", "logo": { "@type": "ImageObject", "url": "https://forfwd.tech/banner.png" } },
  "url": "https://forfwd.tech/blog/how-to-switch-careers-without-starting-over",
  "mainEntityOfPage": "https://forfwd.tech/blog/how-to-switch-careers-without-starting-over",
  "keywords": ["career change", "career pivot", "transferable skills", "career switch", "AI career advisor"]
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://forfwd.tech" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://forfwd.tech/blog" },
    { "@type": "ListItem", "position": 3, "name": "How to Switch Careers Without Starting Over", "item": "https://forfwd.tech/blog/how-to-switch-careers-without-starting-over" }
  ]
};


export default function CareerSwitchPost() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 10%, #4f46e5 0, transparent 50%), radial-gradient(circle at 20% 90%, #7c3aed 0, transparent 40%)",
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
              <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                Career Pivots
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Calendar className="h-3 w-3" /> May 8, 2026
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Clock className="h-3 w-3" /> 6 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              How to Switch Careers Without Starting Over
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-xl leading-relaxed font-normal">
              Thinking about changing careers but terrified of losing everything you've built? Here's how to transfer your existing skills into a completely new field — without going back to square one.
            </p>
          </div>

          {/* Article Body */}
          <div className="prose prose-slate dark:prose-invert prose-lg max-w-none space-y-8">

            <div className="p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">The Reality Check</p>
              <p className="text-slate-700 dark:text-zinc-300 text-base leading-relaxed m-0">
                Most people who think about switching careers spend 3–5 years doing nothing about it. They tell themselves they'll "do more research," or wait until the "right moment." The right moment never comes. This article is about helping you move forward right now, with what you already have.
              </p>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Step 1: Stop Calling It a "Career Change"</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                The biggest mental block people face when switching careers is the idea that everything they know becomes worthless. That's simply not true.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                A former nurse who moves into healthcare technology brings something no CS graduate can replicate: a deep, intuitive understanding of how hospitals actually work. A teacher who pivots into instructional design for software companies brings years of experience making complex things simple. These aren't small advantages — they're enormous ones.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Instead of calling it a "career change," start calling it a <strong className="text-slate-800 dark:text-zinc-100">"career extension."</strong> You're not abandoning what you know — you're adding a new layer on top of it.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Step 2: Do a Skills Inventory (Not a Gap Analysis)</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Most career advice tells you to focus on what you're missing. That's backwards. Start by listing what you already have:
              </p>
              <ul className="space-y-2 text-slate-600 dark:text-zinc-400">
                <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span> Technical skills (software, tools, platforms)</li>
                <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span> Soft skills (communication, leadership, problem-solving)</li>
                <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span> Domain knowledge (industry-specific expertise)</li>
                <li className="flex items-start gap-2"><span className="text-indigo-500 font-bold mt-0.5">→</span> Network (people who can vouch for your capabilities)</li>
              </ul>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed mt-4">
                Once you have this list, look for target roles that value 60–70% of what you already bring. You don't need a 100% match — no one does. The remaining 30% is the bridge you'll build over the next 6–12 months.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Step 3: Build a Bridge, Not a Wall</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                The biggest mistake people make when pivoting is trying to make the full leap in one go. They quit their job, go back to school full-time, and spend two years building a completely new identity from scratch.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Instead, build incrementally. Here's a practical 3-phase bridge strategy:
              </p>
              <div className="grid gap-4 mt-4">
                {[
                  { phase: "Phase 1", title: "Learn Nights & Weekends (Months 1–4)", desc: "Use focused micro-courses (not bootcamps) to learn the foundational skills of your target field. Aim for 1 certification or 1 portfolio project per month." },
                  { phase: "Phase 2", title: "Get Adjacent Work (Months 4–8)", desc: "Look for bridge roles: positions inside your current organization that overlap with your target field, or freelance projects that let you build proof-of-work without fully committing." },
                  { phase: "Phase 3", title: "Make the Full Move (Months 8–12)", desc: "By now you have 3–4 portfolio projects, 1–2 certifications, and real experience to show. You're no longer a beginner — you're a career extender with a compelling story." },
                ].map((item) => (
                  <div key={item.phase} className="p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">{item.phase}</span>
                      <span className="text-sm font-bold text-slate-800 dark:text-zinc-100">{item.title}</span>
                    </div>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">The Bottom Line</h2>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Switching careers is not about starting over. It's about recognizing that your existing experience is an asset — even in a completely new field. The people who successfully pivot are not the ones who wait for the perfect moment. They're the ones who start building bridges before they need them.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Forfwd can help you map out your exact pivot path — showing you which skills transfer, which gaps to close first, and what your realistic timeline looks like based on live job market data.
              </p>
            </section>

            {/* CTA */}
            <div className="mt-10 p-7 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 text-center">
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mb-2">Ready to map your career pivot?</p>
              <p className="text-slate-600 dark:text-zinc-400 text-sm mb-5">Forfwd builds you a personalized, step-by-step career roadmap based on your specific skills and target roles — completely free to try.</p>
              <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-colors">
                Try Forfwd Free <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
