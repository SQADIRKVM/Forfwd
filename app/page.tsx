'use client';

import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Compass,
  Search, Globe, PlayCircle, ExternalLink, Lock, CheckCircle2, TrendingUp, GraduationCap, Briefcase, RefreshCw, ChevronDown, Check, X, Activity
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { authClient } from "@/lib/auth/client";
import { UserAccountNav } from '@/components/shared/UserAccountNav';
import { AuthModal } from '@/components/shared/AuthModal';

// Mouse tracking glow card
function GlowCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const divRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => { setIsFocused(true); setOpacity(1); };
    const handleBlur = () => { setIsFocused(false); setOpacity(0); };
    const handleMouseEnter = () => { setOpacity(1); };
    const handleMouseLeave = () => { setOpacity(0); };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-[2rem] border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/40 p-8 md:p-10 transition-colors hover:border-zinc-300 dark:hover:border-white/20 ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
                }}
            />
            <div className="relative z-10 h-full">{children}</div>
        </div>
    );
}

// FAQ Accordion
function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-zinc-200 dark:border-white/10 py-6">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full justify-between items-center text-left focus:outline-none group">
                <h3 className="text-xl font-medium text-zinc-800 dark:text-white group-hover:text-indigo-500 transition-colors">{question}</h3>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pt-4 text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LandingPage() {
  const { data: session } = authClient.useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
  };
  
  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-white dark:bg-[#050505] text-zinc-900 dark:text-zinc-50 font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-60 dark:opacity-100">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/5 dark:bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

         {/* Minimalist Header */}
        <header className="w-full border-b border-zinc-200 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/banner.png" alt="Forfwd" className="h-15 w-auto object-contain block dark:hidden transition-transform group-hover:scale-[1.02]" />
              <img src="/banner-dark.png" alt="Forfwd" className="h-15 w-auto object-contain hidden dark:block transition-transform group-hover:scale-[1.02]" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                  { label: 'How it works', id: 'how-it-works' },
                  { label: 'Features', id: 'features' },
                  { label: 'FAQ', id: 'faq' }
              ].map((item) => (
                <button key={item.label} onClick={() => scrollTo(item.id)} className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {!session ? (
                <UserAccountNav variant="dark" />
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button className="bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/20 rounded-full px-6 h-10 transition-all font-medium text-sm">
                      Dashboard
                    </Button>
                  </Link>
                  <UserAccountNav variant="dark" />
                </div>
              )}
            </div>
          </nav>
        </header>

        {/* Hero Section: Parallax */}
        <motion.section 
          style={{ y, opacity }}
          className="relative pt-32 pb-24 px-6 md:px-12 flex flex-col items-center min-h-[90vh] justify-center origin-top"
        >
          <div className="max-w-4xl mx-auto text-center z-10">
            
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] mb-8 text-xs md:text-sm font-semibold text-zinc-600 dark:text-zinc-300 backdrop-blur-md shadow-sm"
             >
               <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
               Move forward. Plan better.
             </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[6.5rem] font-semibold tracking-tighter mb-8 text-zinc-900 dark:text-white leading-[1.05]"
            >
              Stop guessing your <br/>
              <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">career path.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-normal leading-relaxed tracking-tight"
            >
              We scan thousands of live job postings and university requirements to build a clear, step-by-step roadmap for your exact situation. No generic advice.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center items-center flex-col sm:flex-row gap-4"
            >
              {!session ? (
                <Link href="/onboarding">
                  <Button className="h-14 px-10 rounded-full font-bold text-base bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-600 text-white transition-all flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(79,70,229,0.25)] dark:shadow-[0_0_40px_rgba(79,70,229,0.15)]">
                    Start Planning Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button className="h-14 px-10 rounded-full font-bold text-base bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-600 text-white transition-all flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(79,70,229,0.25)] dark:shadow-[0_0_40px_rgba(79,70,229,0.15)]">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
              <Link href="/dashboard?example=true">
                <Button variant="outline" className="h-14 px-10 rounded-full font-medium text-base border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white bg-white/50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5 text-zinc-400" />
                  View an Example
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-white dark:from-[#050505] to-transparent pointer-events-none" />
        </motion.section>

        {/* Who is this for? */}
        <section className="py-32 px-6 md:px-12 bg-white dark:bg-[#050505] relative z-20 border-t border-zinc-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-5 text-xs font-semibold tracking-wider uppercase text-indigo-400"
                    >
                        Audience Profiles
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white mb-5">Who is Forfwd built for?</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                        Whether you are navigating high school, orchestrating a mid-career pivot, or optimizing a resume, we find the real-time data that matters to you.
                    </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: GraduationCap,
                            colorClass: "text-indigo-400",
                            bgGradient: "from-indigo-500/20 to-indigo-500/5",
                            borderHover: "hover:border-indigo-500/30 hover:shadow-[0_0_50px_rgba(99,102,241,0.15)]",
                            title: "High School Students",
                            desc: "Don't select a university major blindly. Map out exact degrees and certifications that convert directly into high-paying, future-proof roles before investing in tuition."
                        },
                        {
                            icon: RefreshCw,
                            colorClass: "text-emerald-400",
                            bgGradient: "from-emerald-500/20 to-emerald-500/5",
                            borderHover: "hover:border-emerald-500/30 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]",
                            title: "Career Switchers",
                            desc: "Calculate your exact transferability score. Map out the absolute shortest bridge pathway from your current role to your target career with structured, focused milestones."
                        },
                        {
                            icon: Briefcase,
                            colorClass: "text-amber-400",
                            bgGradient: "from-amber-500/20 to-amber-500/5",
                            borderHover: "hover:border-amber-500/30 hover:shadow-[0_0_50px_rgba(245,158,11,0.15)]",
                            title: "Job Seekers",
                            desc: "Run our high-end ATS compatibility scanner to uncover missing keywords, optimize your profile, and realign your portfolio with what companies are hiring for today."
                        }
                    ].map((card, i) => (
                        <motion.div 
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/35 p-10 md:p-12 transition-all duration-500 ${card.borderHover}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 dark:to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className={`w-14 h-14 bg-gradient-to-br ${card.bgGradient} rounded-2xl flex items-center justify-center mb-8 border border-zinc-200 dark:border-white/10 shadow-lg relative z-10`}>
                                <card.icon className={`w-7 h-7 ${card.colorClass}`} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-800 dark:text-white mb-4 tracking-tight relative z-10 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">{card.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg relative z-10 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-32 px-6 md:px-12 relative z-20 bg-zinc-50 dark:bg-[#080808] border-t border-zinc-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24 md:w-2/3">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-5 text-xs font-semibold tracking-wider uppercase text-violet-400"
                >
                    Core Features
                </motion.div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-white leading-tight">Built on real-time data,<br />not generic assumptions.</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl font-normal">
                    Traditional career guidance relies on stale datasets. Forfwd conducts targeted live-web research to pull precise hiring trends, salaries, and real opinions right now.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Large Card: Live Market Research */}
              <GlowCard className="col-span-1 md:col-span-2 flex flex-col justify-between group min-h-[480px] hover:border-indigo-500/20 hover:shadow-[0_0_80px_rgba(99,102,241,0.08)] transition-all duration-500">
                <div className="absolute -top-10 -right-10 p-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-105 transition-all duration-700 ease-out pointer-events-none">
                  <Globe className="w-96 h-96 text-indigo-500" />
                </div>
                <div className="relative z-10 max-w-xl mt-auto p-2">
                  <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-10 border border-zinc-200 dark:border-white/10 shadow-xl group-hover:border-indigo-500/30 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-500">
                    <Search className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight text-zinc-900 dark:text-white">Live Market RAG Research</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg font-normal group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    When you complete our adaptive questionnaire, our platform instantly launches parallel web queries via SearXNG to scrape actual job boards, corporate listings, and academic databases, synthesizing a highly custom study dashboard.
                  </p>
                </div>
              </GlowCard>

              {/* Actionable Next Steps */}
              <GlowCard className="col-span-1 flex flex-col justify-between group p-10 hover:border-emerald-500/20 hover:shadow-[0_0_80px_rgba(16,185,129,0.08)] transition-all duration-500">
                <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-8 border border-zinc-200 dark:border-white/10 shadow-xl group-hover:border-emerald-500/30 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-500">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-zinc-800 dark:text-white group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">Actionable Milestones</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    We do not deliver static, generic descriptions. You get highly specific upskilling milestones, complete with real recommended courses, certifications, and interactive tracking progress.
                  </p>
                </div>
              </GlowCard>

              {/* Salary Transparency with Mini Graph */}
              <GlowCard className="col-span-1 flex flex-col justify-between group p-10 hover:border-amber-500/20 hover:shadow-[0_0_80px_rgba(245,158,11,0.08)] transition-all duration-500">
                <div className="mb-8">
                  <div className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-8 border border-zinc-200 dark:border-white/10 shadow-xl group-hover:border-amber-500/30 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500">
                    <TrendingUp className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                  </div>
                  
                  {/* Dynamic Custom Chart */}
                  <div className="flex items-end gap-3 h-24 w-full px-4 mb-6 border-b border-zinc-200 dark:border-white/5 relative">
                    <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-zinc-200 dark:border-white/5 pointer-events-none" />
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-md h-[30%] transition-all duration-700 group-hover:h-[40%] group-hover:bg-amber-500/20" />
                      <span className="text-[10px] font-mono text-zinc-500">Jr</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-t-md h-[55%] transition-all duration-700 group-hover:h-[65%] group-hover:bg-amber-500/40" />
                      <span className="text-[10px] font-mono text-zinc-500">Mid</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-zinc-300 dark:bg-zinc-700 rounded-t-md h-[75%] transition-all duration-700 group-hover:h-[85%] group-hover:bg-amber-500/70" />
                      <span className="text-[10px] font-mono text-zinc-500">Sr</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-amber-500 rounded-t-md h-[90%] shadow-[0_0_20px_rgba(245,158,11,0.4)]" />
                      <span className="text-[10px] font-mono text-amber-500 dark:text-amber-400 font-semibold">Exec</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 tracking-tight text-zinc-800 dark:text-white">Salary Transparency</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    Access localized, role-specific salary curves generated in real-time based on live hiring requirements, letting you negotiate your true market worth with solid evidence.
                  </p>
                </div>
              </GlowCard>

              {/* Wide Card: 100% Secure & Private */}
              <GlowCard className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-12 hover:border-violet-500/20 hover:shadow-[0_0_80px_rgba(139,92,246,0.08)] transition-all duration-500">
                <div className="flex-1">
                  <div id="privacy" className="w-14 h-14 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl flex items-center justify-center mb-8 border border-zinc-200 dark:border-white/10 shadow-xl group-hover:border-violet-500/30 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] transition-all duration-500">
                    <Lock className="w-6 h-6 text-violet-500 dark:text-violet-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight text-zinc-800 dark:text-white">100% Private, Safe, & Permanent</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg font-normal group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors">
                    Your assessment, upload assets, and personal details remain completely secure. We leverage secure database storage to track and persist only your authorized learning hubs and milestone progress. You remain in complete control.
                  </p>
                </div>
                <div className="w-full md:w-2/5 aspect-video bg-zinc-100 dark:bg-black/60 rounded-3xl border border-zinc-200 dark:border-white/10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <div className="absolute inset-x-0 h-px top-0 bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
                   <div className="w-12 h-12 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-3 animate-pulse relative">
                     <Lock className="w-5 h-5 text-violet-500 dark:text-violet-400" />
                   </div>
                   <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 group-hover:text-violet-600 dark:group-hover:text-violet-300 transition-colors tracking-wide">Secure Session Encryption</span>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* Execution Flow */}
        <section id="how-it-works" className="py-32 px-6 md:px-12 bg-white dark:bg-[#050505] relative border-t border-zinc-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-5 text-xs font-semibold tracking-wider uppercase text-emerald-400"
                >
                    Workflow
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-14 text-zinc-900 dark:text-white leading-tight">How Forfwd works</h2>
                <div className="space-y-12 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-zinc-200 dark:before:bg-white/5">
                  {[
                    { num: '1', title: 'Tell us about yourself', desc: 'Complete a brief, adaptive questionnaire mapping your existing background, preferred location, target budget, and core academic interests.' },
                    { num: '2', title: 'Live Search Aggregation', desc: 'Our platform coordinates parallel web searches, scanning current job boards and university requirements specifically matching your target criteria.' },
                    { num: '3', title: 'Interactive Learning Hub', desc: 'Unlock an ultra-premium dashboard featuring personalized milestones, an interactive tracking schedule, and an ATS-grade resume compatibility optimizer.' },
                  ].map((step, i) => (
                    <motion.div 
                        key={step.num} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="flex gap-6 group relative"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-sm font-bold text-zinc-500 dark:text-zinc-400 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:text-black transition-all duration-500 shadow-md">
                        {step.num}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-xl font-bold text-zinc-800 dark:text-white mb-2 tracking-tight group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">{step.title}</h4>
                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg font-normal">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Premium Mac-Style Terminal Console */}
              <GlowCard className="p-0 !bg-black/80 overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]">
                {/* Mac Header */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-zinc-950">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
                  <span className="text-[11px] font-mono text-zinc-500 ml-4">forfwd_engine.sh</span>
                </div>
                
                <div className="p-8 space-y-6 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Searching online job boards...</span>
                    </div>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">SUCCESS</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Processing live RAG documents...</span>
                    </div>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">DONE</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Parsing university catalogs...</span>
                    </div>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">COMPILED</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Synthesizing roadmap nodes...</span>
                    </div>
                    <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">READY</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.15)] transition-all duration-300 animate-bounce">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                      <span className="font-semibold">Interactive Report Loaded</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-indigo-400" />
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* Traditional vs Forfwd */}
        <section className="py-24 px-6 md:px-12 bg-zinc-50 dark:bg-[#080808] relative border-t border-zinc-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-5 text-xs font-semibold tracking-wider uppercase text-amber-400"
                    >
                        Comparison
                    </motion.div>
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Why we built Forfwd</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
                        Conventional career platforms rely on historical indices that completely ignore modern workplace adjustments.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Traditional */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-10 md:p-12 bg-white dark:bg-zinc-950/40 border border-red-500/20 rounded-[2.5rem] relative overflow-hidden group hover:border-red-500/25 transition-all duration-500 shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/[0.01] rounded-full blur-[80px]" />
                        <h3 className="text-2xl font-bold text-rose-500 mb-8 tracking-tight flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 text-sm border border-rose-500/20">✕</span> 
                            Traditional Advice
                        </h3>
                        <ul className="space-y-6 text-zinc-600 dark:text-zinc-400 text-base md:text-lg font-normal">
                          {[
                            "Relying on years-old static surveys and generic government statistics.",
                            "Pushing broad, non-specific general college degrees without financial analysis.",
                            "Suggesting skills blindly without analyzing live job market postings.",
                            "Leaving students blind to rapid automation risk and technical shifts."
                          ].map((item, idx) => (
                            <li key={idx} className="flex gap-4">
                              <span className="text-rose-500/50 pt-1 font-mono">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                    </motion.div>
                    
                    {/* Forfwd */}
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-10 md:p-12 bg-white dark:bg-indigo-950/15 border border-indigo-500/20 rounded-[2.5rem] relative overflow-hidden group hover:border-indigo-500/25 transition-all duration-500 shadow-xl"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.03] rounded-full blur-[90px]" />
                        <h3 className="text-2xl font-bold text-indigo-500 dark:text-indigo-400 mb-8 tracking-tight flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 text-sm border border-indigo-500/20">✓</span> 
                            The Forfwd Approach
                        </h3>
                        <ul className="space-y-6 text-zinc-600 dark:text-zinc-300 text-base md:text-lg font-normal">
                          {[
                            "Live-scraping real-time job boards for high-fidelity salary insights.",
                            "Directly correlating user interests with economically expanding markets.",
                            "Extracting exact up-to-date tool, framework, and certification requirements.",
                            "Continuous updates reflecting live hiring demands and active trends."
                          ].map((item, idx) => (
                            <li key={idx} className="flex gap-4">
                              <span className="text-indigo-500 dark:text-indigo-400 pt-1 font-semibold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-6 md:px-12 bg-white dark:bg-[#050505] relative border-t border-zinc-200 dark:border-white/5">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-5 text-xs font-semibold tracking-wider uppercase text-violet-400"
                    >
                        FAQ
                    </motion.div>
                    <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4">Frequently Asked Questions</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-xl mx-auto font-normal">
                        Have some questions about our operations? We have answered the most common ones.
                    </p>
                </div>
                <div className="border-t border-zinc-200 dark:border-white/10 max-w-3xl mx-auto bg-zinc-50 dark:bg-zinc-950/20 p-8 md:p-12 rounded-[2.5rem] border border-zinc-200 dark:border-white/5">
                    <FAQItem 
                        question="Is it completely free to use?" 
                        answer="Yes. There are no paywalls, locked features, subscriptions, or hidden costs. Forfwd is fully designed to deliver open, data-driven academic and professional path assistance."
                    />
                    <FAQItem 
                        question="Do I need to create an account?" 
                        answer="An account is highly recommended! Signing up lets you save your reports to our secure cloud database, update your roadmap progress, and utilize our premium ATS resume optimizer."
                    />
                    <FAQItem 
                        question="Can I track custom courses and playlists?" 
                        answer="Yes, absolutely! The platform features an integrated My Learning Hub where you can add and track study resources from Udemy, Coursera, YouTube, or any custom URL. You can log progress, configure study plans, and organize your upskilling schedule in real-time."
                    />
                    <FAQItem 
                        question="How does the ATS Resume Optimizer work?" 
                        answer="Our advanced scanner analyzes your uploaded resume against real-time job profiles. It computes an overall compatibility score, identifies critical keyword gaps, and offers a single-click AI-powered 'Auto-Optimize' tool to rewrite your resume with a beautiful side-by-side comparative diff."
                    />
                    <FAQItem 
                        question="How accurate is the salary data?" 
                        answer="We do not rely on static tables. During your generation session, we run active searches on live databases to fetch contemporary, geographically specific salary curves."
                    />
                    <FAQItem 
                        question="Can I export my custom roadmap?" 
                        answer="Absolutely! Once your report is generated, clicking the 'Export PDF' button formats your strategic timeline into a beautiful, publication-grade print format."
                    />
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-44 px-6 md:px-12 relative overflow-hidden flex justify-center border-t border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-[#080808]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-4xl text-center relative z-10">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter text-zinc-900 dark:text-white leading-tight">Find your direction.</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-2xl max-w-3xl mx-auto mb-14 font-normal leading-relaxed tracking-tight">
              Stop guessing. Access a structured, step-by-step career path based exactly on what the real-world job market demands today.
            </p>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link href="/onboarding">
                <Button className="h-16 px-12 rounded-full font-bold text-lg bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center justify-center gap-3.5 mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(255,255,255,0.18)] group cursor-pointer">
                  Start Your Assessment
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-12 px-6 md:px-12 border-t border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src="/banner.png" alt="Forfwd" className="h-10 w-auto object-contain block dark:hidden opacity-50 hover:opacity-100 transition-all duration-300" />
              <img src="/banner-dark.png" alt="Forfwd" className="h-10 w-auto object-contain hidden dark:block opacity-40 hover:opacity-100 transition-all duration-300" />
            </div>
            <div className="flex gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-600">
              <Link href="/docs" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Documentation</Link>
              <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>

      </div>
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
