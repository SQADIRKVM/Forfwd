"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Calendar, FileText, Search, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Beat the ATS: Resume Tips That Actually Work in 2026",
  "description": "Most resumes never reach a human being. They get filtered out by an Applicant Tracking System. Here's exactly how to write a resume that passes ATS checks and lands interviews.",
  "datePublished": "2026-05-07",
  "dateModified": "2026-05-07",
  "author": { "@type": "Organization", "name": "Forfwd", "url": "https://forfwd.tech" },
  "publisher": { "@type": "Organization", "name": "Forfwd", "logo": { "@type": "ImageObject", "url": "https://forfwd.tech/banner.png" } },
  "url": "https://forfwd.tech/blog/beat-the-ats-resume-tips-that-actually-work",
  "mainEntityOfPage": "https://forfwd.tech/blog/beat-the-ats-resume-tips-that-actually-work",
  "keywords": ["ATS resume", "resume tips 2026", "applicant tracking system", "beat ATS", "resume optimization", "ATS scanner"]
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://forfwd.tech" },
    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://forfwd.tech/blog" },
    { "@type": "ListItem", "position": 3, "name": "Beat the ATS: Resume Tips That Actually Work in 2026", "item": "https://forfwd.tech/blog/beat-the-ats-resume-tips-that-actually-work" }
  ]
};

export default function ATSResumePost() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 15%, #10b981 0, transparent 50%), radial-gradient(circle at 15% 85%, #059669 0, transparent 40%)",
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
              <span className="px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                Resume Tips
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Calendar className="h-3 w-3" /> May 7, 2026
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Clock className="h-3 w-3" /> 8 min read
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              Beat the ATS: Resume Tips That Actually Work in 2026
            </h1>
            <p className="text-slate-600 dark:text-zinc-400 text-base md:text-xl leading-relaxed font-normal">
              Most resumes never reach a human being. They get filtered out by an Applicant Tracking System before anyone sees them. Here's exactly how to write a resume that passes ATS checks and lands interviews.
            </p>
          </div>

          {/* Article Body */}
          <div className="space-y-8">

            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Did You Know?</p>
              <p className="text-slate-700 dark:text-zinc-300 text-base leading-relaxed m-0">
                Over <strong>75% of resumes</strong> are automatically rejected by ATS software before a recruiter ever lays eyes on them. This isn't because candidates aren't qualified — it's because their resume wasn't formatted to speak the machine's language.
              </p>
            </div>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Search className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">What Is an ATS and Why Does It Reject You?</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                An Applicant Tracking System (ATS) is software that companies use to manage job applications at scale. When you hit "Submit" on a job application, your resume doesn't go straight to a hiring manager's inbox. It goes into the ATS first.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                The ATS scans your resume for specific keywords and phrases that match the job description. If your document doesn't contain enough matching signals, the system scores you low — and your resume gets buried or automatically filtered out, even if you're perfectly qualified for the role.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  <FileText className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">The ATS-Friendly Resume Formula</h2>
              </div>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                Here's the exact formula that consistently gets resumes past ATS filters and onto recruiter desks:
              </p>

              <div className="grid gap-4 mt-4">
                {[
                  {
                    step: "01",
                    title: "Use a Clean, Single-Column Layout",
                    desc: "ATS parsers struggle with multi-column layouts, tables, text boxes, and graphics. Stick to a clean, simple single-column format with standard section headers: 'Work Experience', 'Education', 'Skills'.",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    step: "02",
                    title: "Mirror the Job Description's Language Exactly",
                    desc: "Copy-paste the job posting into a word cloud tool and identify the most frequently used terms. If the job says 'cross-functional collaboration', don't write 'worked with different teams'. Use their exact phrasing.",
                    color: "text-teal-600 dark:text-teal-400",
                  },
                  {
                    step: "03",
                    title: "Front-Load Your Most Important Keywords",
                    desc: "ATS systems weight keywords higher when they appear in the first third of your resume. Make sure your strongest matching skills appear in your summary/headline and in your first 2 job entries.",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    step: "04",
                    title: "Quantify Everything That Can Be Quantified",
                    desc: "ATS systems and humans both respond to numbers. Not 'managed a team' but 'managed a team of 12 engineers across 3 time zones, reducing deployment failures by 40%'. Numbers make vague achievements concrete.",
                    color: "text-teal-600 dark:text-teal-400",
                  },
                  {
                    step: "05",
                    title: "Save as .docx or Plain PDF — Never Infographic PDF",
                    desc: "Infographic, designed, or visually heavy PDFs are ATS kryptonite. The parser can't extract text from them reliably. Use a plain .docx or a standard PDF exported from Google Docs or Word.",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                ].map((item) => (
                  <div key={item.step} className="p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f]">
                    <div className="flex items-start gap-4">
                      <span className={`text-2xl font-black ${item.color} shrink-0 leading-none`}>{item.step}</span>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-zinc-100 mb-1 text-sm">{item.title}</p>
                        <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight">Your ATS Pre-Submission Checklist</h2>
              </div>
              <div className="space-y-2">
                {[
                  "Simple, single-column layout with standard section headers",
                  "Keywords pulled directly from the job description appear in top third",
                  "At least 4–5 quantified achievements across your experience section",
                  "Saved as .docx or a plain, text-readable PDF",
                  "No tables, text boxes, or graphic elements",
                  "Contact information at the very top (not in a header field)",
                  "Tailored version for each role — not one generic version",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-white/5 bg-white dark:bg-[#0f0f0f]">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 dark:text-zinc-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-2xl font-black tracking-tight mb-4">The Bottom Line</h2>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                You can be the most qualified person for a job and still get rejected before a human even glances at your resume. The ATS is a gatekeeper — and passing it is a skill you can learn in an afternoon.
              </p>
              <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                The tips in this article will get you past the initial filter. Once you're through, it's your skills, your story, and your personality that close the deal.
              </p>
            </section>

            {/* CTA */}
            <div className="mt-10 p-7 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 text-center">
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mb-2">Get an instant ATS score on your resume</p>
              <p className="text-slate-600 dark:text-zinc-400 text-sm mb-5">Forfwd's AI-powered ATS Resume Scanner checks your document against your target role and gives you precise, actionable recommendations — in seconds.</p>
              <Link href="/resume-scan" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-colors">
                Scan My Resume Free <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
