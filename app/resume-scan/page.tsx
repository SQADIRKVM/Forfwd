'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowLeft, FileText, Loader2, CheckCircle2, AlertCircle, Zap, Search, Target } from 'lucide-react';
import Link from 'next/link';
import { UserAccountNav } from '@/components/shared/UserAccountNav';
import { useOnboardingStore } from '@/lib/store';
import { toast } from 'sonner';

interface ScanResult {
  matchScore: number;
  missingKeywords: string[];
  feedback: string;
}

const JOB_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer", "Product Manager",
  "UI/UX Designer", "Cybersecurity Analyst", "Cloud Architect", "Mobile Developer",
  "Business Analyst", "Marketing Manager", "Financial Analyst", "Data Analyst",
];

function ScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? '#10b981' : score >= 45 ? '#f59e0b' : '#ef4444';
  const label = score >= 70 ? 'Strong Match' : score >= 45 ? 'Partial Match' : 'Weak Match';
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/5" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-slate-900 dark:text-zinc-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ color, backgroundColor: `${color}18` }}>
        {label}
      </span>
    </div>
  );
}

export default function ResumeScanPage() {
  const { studentType } = useOnboardingStore();
  const [resumeText, setResumeText] = useState('');
  const [jobRole, setJobRole] = useState(studentType || '');
  const [customRole, setCustomRole] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const effectiveRole = jobRole === '__custom__' ? customRole : jobRole;

  const handleScan = async () => {
    if (!resumeText.trim()) { toast.error('Please paste your resume text first'); return; }
    if (!effectiveRole.trim()) { toast.error('Please select or enter a target job role'); return; }

    setIsScanning(true);
    setResult(null);
    try {
      const res = await fetch('/api/scan-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, jobRole: effectiveRole }),
      });
      if (!res.ok) throw new Error('Scan failed');
      const data = await res.json();
      setResult(data);
      toast.success('Resume scanned successfully!');
    } catch {
      toast.error('Failed to scan resume. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setResumeText('');
  };

  return (
    <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-zinc-50 flex flex-col font-sans">

      {/* Nav */}
      <header className="w-full bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">Forfwd</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <Link href="/dashboard" className="text-sm font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
          <UserAccountNav />
        </nav>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-6">
            <Zap className="w-3 h-3" />
            ATS Resume Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-zinc-50 mb-4 tracking-tight">
            Will your resume pass<br className="hidden md:block" />
            <span className="text-indigo-600 dark:text-indigo-400"> the ATS filter?</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
            Paste your resume and target role. Our AI acts as a real recruiter&apos;s ATS to score and give you actionable feedback in seconds.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Left: Resume input */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Your Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here. Include your work experience, education, skills, and any relevant projects..."
                  className="w-full h-80 resize-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 transition-all shadow-sm leading-relaxed"
                />
                <p className="text-xs text-slate-400 dark:text-zinc-600">{resumeText.length > 0 ? `${resumeText.split(/\s+/).filter(Boolean).length} words` : 'Tip: Include all sections for the most accurate score'}</p>
              </div>

              {/* Right: Role selector */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-zinc-300">
                    <Target className="w-4 h-4 text-indigo-500" />
                    Target Job Role
                  </label>
                  <select
                    value={jobRole}
                    onChange={e => setJobRole(e.target.value)}
                    className="w-full appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 text-slate-900 dark:text-zinc-50 font-medium px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 transition-all cursor-pointer text-sm"
                  >
                    <option value="">Select a role...</option>
                    {JOB_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    <option value="__custom__">Other (type below)</option>
                  </select>
                  {jobRole === '__custom__' && (
                    <input
                      type="text"
                      value={customRole}
                      onChange={e => setCustomRole(e.target.value)}
                      placeholder="e.g. Quantitative Analyst"
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 text-slate-900 dark:text-zinc-50 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 transition-all text-sm"
                    />
                  )}
                </div>

                {/* What we check */}
                <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <p className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-3">What we analyse:</p>
                  {['ATS keyword density vs your target role', 'Missing hard skills & technical terms', 'Actionable improvement suggestions'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-zinc-400 py-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleScan}
                  disabled={isScanning || !resumeText.trim() || !effectiveRole.trim()}
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {isScanning ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Scanning your resume...</>
                  ) : (
                    <><Search className="w-5 h-5" /> Scan Resume</>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              {/* Score card */}
              <div className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-sm">
                <p className="text-sm font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-6">ATS Match Score for <span className="text-indigo-600 dark:text-indigo-400">{effectiveRole}</span></p>
                <ScoreRing score={result.matchScore} />
                <p className="text-slate-600 dark:text-zinc-400 mt-6 text-base leading-relaxed max-w-lg mx-auto">{result.feedback}</p>
              </div>

              {/* Missing keywords */}
              {result.missingKeywords.length > 0 && (
                <div className="bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-50 flex items-center gap-2 mb-5">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Missing Keywords — Add These to Your Resume
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-semibold">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 font-semibold transition-all border border-slate-200 dark:border-white/10"
                >
                  Scan Another Resume
                </button>
                <Link href="/dashboard" className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all flex items-center justify-center">
                  Back to Dashboard
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
