'use client';

import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Compass, Database, Zap, ShieldCheck, Cpu, 
  Search, Globe, Network, Github, Twitter, Linkedin, Mail, PlayCircle, ExternalLink, Lock, CheckCircle2, TrendingUp, BookOpen, GraduationCap, Briefcase, RefreshCw, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';

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
            className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900/40 p-8 md:p-10 transition-colors hover:border-white/20 ${className}`}
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
        <div className="border-b border-white/10 py-6">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full justify-between items-center text-left focus:outline-none group">
                <h3 className="text-xl font-medium text-white group-hover:text-indigo-400 transition-colors">{question}</h3>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="pt-4 text-zinc-400 text-lg leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
  };
  
  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#050505] text-zinc-50 font-sans selection:bg-indigo-500/30 selection:text-white overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Minimalist Header */}
        <header className="w-full border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:border-white/20">
                <Compass className="w-4 h-4 text-zinc-100" />
              </div>
              <span className="text-xl font-semibold tracking-tight">CareerX</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                  { label: 'How it works', id: 'how-it-works' },
                  { label: 'Features', id: 'features' },
                  { label: 'FAQ', id: 'faq' }
              ].map((item) => (
                <button key={item.label} onClick={() => scrollTo(item.id)} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Link href="/onboarding">
                <Button className="bg-white hover:bg-zinc-200 text-black rounded-full px-6 h-10 transition-all font-medium text-sm">
                  Start Free
                </Button>
              </Link>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 text-sm font-medium text-zinc-300 backdrop-blur-md shadow-xl"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              No sign-up required. 100% free.
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-[6.5rem] font-semibold tracking-tighter mb-8 text-white leading-[1.05]"
            >
              Stop guessing your <br/>
              <span className="text-zinc-500">career path.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-normal leading-relaxed tracking-tight"
            >
              We scan thousands of live job postings and university requirements to build a clear, step-by-step roadmap for your exact situation. No generic advice.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center items-center flex-col sm:flex-row gap-4"
            >
              <Link href="/onboarding">
                <Button className="h-14 px-10 rounded-full font-medium text-base bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]">
                  Start Your Assessment
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="h-14 px-10 rounded-full font-medium text-base border-white/10 text-white bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5 text-zinc-400" />
                  View an Example
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        </motion.section>

        {/* Who is this for? */}
        <section className="py-24 px-6 md:px-12 bg-[#050505] relative z-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Who is CareerX built for?</h2>
                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto">Whether you are just starting out or making a major pivot, we find the data that matters to you.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <GraduationCap className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">High School Students</h3>
                        <p className="text-zinc-400 leading-relaxed text-lg">Don't pick a major blindly. See exactly what degrees lead to high-paying jobs before you spend thousands on tuition.</p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <RefreshCw className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Career Switchers</h3>
                        <p className="text-zinc-400 leading-relaxed text-lg">Find the shortest path from your current role to your dream job. We identify the exact skill gaps you need to bridge.</p>
                    </div>
                    <div className="p-8 rounded-[2rem] bg-zinc-900/20 border border-white/5">
                        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <Briefcase className="w-6 h-6 text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-medium text-white mb-3 tracking-tight">Job Seekers</h3>
                        <p className="text-zinc-400 leading-relaxed text-lg">Use our built-in ATS scanner to see what keywords you are missing for the roles you actually want.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Bento Grid Features */}
        <section id="features" className="py-32 px-6 md:px-12 relative z-20 bg-[#0A0A0A] border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 md:w-2/3">
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-white">Built on real data, not assumptions.</h2>
              <p className="text-zinc-400 text-xl leading-relaxed tracking-tight">Most career advice is outdated. We use live web searches to find out exactly what employers are asking for today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Large Card */}
              <GlowCard className="col-span-1 md:col-span-2 flex flex-col justify-between group min-h-[400px]">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 ease-out pointer-events-none">
                  <Globe className="w-64 h-64 text-indigo-500" />
                </div>
                <div className="relative z-10 max-w-lg mt-auto">
                  <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-lg">
                    <Search className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-3xl font-medium mb-4 tracking-tight text-white">Live Market Research</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    When you finish the questionnaire, our system instantly searches the web for current job listings, university curriculums, and salary data to build your report.
                  </p>
                </div>
              </GlowCard>

              {/* Standard Card 1 */}
              <GlowCard className="col-span-1 flex flex-col">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-auto border border-white/10 shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-medium mb-3 tracking-tight text-white">Actionable Next Steps</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    We don't just tell you what career fits. We tell you the exact skills to learn, tools to master, and certifications to get.
                  </p>
                </div>
              </GlowCard>

              {/* Standard Card 2 */}
              <GlowCard className="col-span-1 flex flex-col">
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-auto border border-white/10 shadow-lg">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <div className="mt-12">
                  <h3 className="text-2xl font-medium mb-3 tracking-tight text-white">Salary Transparency</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    Get realistic, location-specific salary bands based on actual job postings, not five-year-old surveys.
                  </p>
                </div>
              </GlowCard>

              {/* Wide Card */}
              <GlowCard className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                  <div id="privacy" className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-lg">
                    <Lock className="w-5 h-5 text-zinc-300" />
                  </div>
                  <h3 className="text-2xl font-medium mb-4 tracking-tight text-white">100% Private & Secure</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">
                    We don't have a database. We don't save your answers. Everything runs locally in your browser session. When you close the tab, your data is gone forever.
                  </p>
                </div>
                <div className="w-full md:w-2/5 aspect-video bg-black/50 rounded-2xl border border-white/5 flex items-center justify-center shadow-inner relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <span className="text-sm font-mono text-zinc-500 relative z-10 group-hover:text-amber-400 transition-colors">Data deleted on exit</span>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* Execution Flow */}
        <section id="how-it-works" className="py-32 px-6 md:px-12 bg-[#050505] relative border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-12 text-white">How it works</h2>
                <div className="space-y-12">
                  {[
                    { num: '1', title: 'Tell us about yourself', desc: 'Answer a few adaptive questions about your background, interests, and what kind of work you want to do.' },
                    { num: '2', title: 'We scan the web', desc: 'Our platform searches for the latest industry requirements and university pathways that actually match your profile.' },
                    { num: '3', title: 'Get your roadmap', desc: 'Receive a detailed dashboard outlining your skill gaps, potential jobs, and the exact next steps to get there.' },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-6 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">{step.num}</div>
                      <div>
                        <h4 className="text-xl font-medium text-white mb-2 tracking-tight">{step.title}</h4>
                        <p className="text-zinc-400 leading-relaxed text-lg">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <GlowCard className="p-0 !bg-black/40">
                <div className="p-8 space-y-4 font-mono text-sm text-zinc-400">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span>Searching job boards...</span>
                    <span className="text-emerald-400">Done</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span>Reading 10 recent articles...</span>
                    <span className="text-emerald-400">Done</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span>Checking university catalogs...</span>
                    <span className="text-emerald-400">Done</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <span>Formatting your roadmap...</span>
                    <span className="text-emerald-400">Done</span>
                  </div>
                  <div className="flex justify-between items-center p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
                    <span>Report ready to view.</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </GlowCard>
            </div>
          </div>
        </section>

        {/* Traditional vs CareerX */}
        <section className="py-24 px-6 md:px-12 bg-[#0A0A0A] relative border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Why we built this.</h2>
                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto">Standard career advice is often disconnected from the realities of the modern job market.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-0 border border-white/10 rounded-[2rem] overflow-hidden">
                    <div className="p-10 md:p-14 bg-zinc-900/20 border-b md:border-b-0 md:border-r border-white/10">
                        <h3 className="text-2xl font-medium text-white mb-8 tracking-tight flex items-center gap-3">
                            <span className="text-rose-500">✕</span> Traditional Advice
                        </h3>
                        <ul className="space-y-6 text-zinc-400 text-lg">
                            <li>Relying on years-old salary surveys and generalized government data.</li>
                            <li>Telling you to "follow your passion" without a realistic financial plan.</li>
                            <li>Broad college major recommendations without specific skill requirements.</li>
                            <li>No way to know if a job will exist in 5 years.</li>
                        </ul>
                    </div>
                    <div className="p-10 md:p-14 bg-indigo-900/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]" />
                        <h3 className="text-2xl font-medium text-white mb-8 tracking-tight flex items-center gap-3 relative z-10">
                            <span className="text-emerald-500">✓</span> The CareerX Approach
                        </h3>
                        <ul className="space-y-6 text-zinc-300 text-lg relative z-10">
                            <li>Real-time scraping of current job postings to find actual salary ranges today.</li>
                            <li>Matching your interests with financially viable and growing markets.</li>
                            <li>Extracting the exact software tools and soft skills mentioned in current job descriptions.</li>
                            <li>Market trend analysis to ensure you are entering a growing field.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-6 md:px-12 bg-[#050505] relative border-t border-white/5">
            <div className="max-w-3xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl font-semibold tracking-tight text-white mb-4">Frequently Asked Questions</h2>
                </div>
                <div className="border-t border-white/10">
                    <FAQItem 
                        question="Is it completely free to use?" 
                        answer="Yes. There are no paywalls, subscriptions, or hidden fees. We believe everyone deserves access to data-backed career guidance."
                    />
                    <FAQItem 
                        question="Do I need to create an account?" 
                        answer="No. To protect your privacy, we don't even have a user database. Your session data is stored locally in your browser and is destroyed as soon as you close the tab."
                    />
                    <FAQItem 
                        question="How accurate is the salary data?" 
                        answer="Instead of relying on static, outdated surveys, our system searches live job boards (like Indeed, LinkedIn, and Glassdoor) during your session to find current, location-specific salary data."
                    />
                    <FAQItem 
                        question="Can I save my report?" 
                        answer="Yes! Once your dashboard is generated, you can click the 'Export PDF' button to save a beautifully formatted copy of your roadmap to your device."
                    />
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-40 px-6 md:px-12 relative overflow-hidden flex justify-center border-t border-white/5 bg-[#0A0A0A]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/20 pointer-events-none" />
          <div className="max-w-4xl text-center relative z-10">
            <h2 className="text-5xl md:text-7xl font-semibold mb-8 tracking-tighter text-white">Find your direction.</h2>
            <p className="text-zinc-400 text-xl md:text-2xl mb-12 tracking-tight">Stop guessing. Get a clear, actionable plan based on what the real world actually demands.</p>
            <Link href="/onboarding">
              <Button className="h-16 px-12 rounded-full font-medium text-lg bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 mx-auto shadow-[0_0_50px_rgba(255,255,255,0.15)] hover:shadow-[0_0_80px_rgba(255,255,255,0.3)] group">
                Start Your Assessment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="py-12 px-6 md:px-12 border-t border-white/5 bg-black">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-zinc-600" />
              <span className="text-sm font-medium text-zinc-600">CareerX</span>
            </div>
            <div className="flex gap-8 text-sm font-medium text-zinc-600">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
