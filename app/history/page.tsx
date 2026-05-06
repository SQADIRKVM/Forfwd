'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ArrowLeft, Clock, Trash2, RotateCcw, FileText, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { UserAccountNav } from '@/components/shared/UserAccountNav';
import { getAllReportsAction, deleteReportAction } from '@/app/actions/report';
import { useOnboardingStore } from '@/lib/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import type { DashboardData } from '@/lib/schemas';

interface Report {
  id: string;
  createdAt: Date;
  data: unknown;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function HistoryPage() {
  const router = useRouter();
  const { setUserName, setStudentType } = useOnboardingStore();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    getAllReportsAction().then(r => {
      setReports(r as Report[]);
      setIsLoading(false);
    });
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteReportAction(id);
    if (result.success) {
      setReports(prev => prev.filter(r => r.id !== id));
      toast.success('Report deleted');
    } else {
      toast.error('Failed to delete report');
    }
    setDeletingId(null);
  };

  const handleLoad = (report: Report) => {
    const data = report.data as DashboardData;
    // Pre-populate the store so dashboard picks it up
    if (data.profileSummary) {
      const nameMatch = data.profileSummary.match(/^([A-Za-z]+)/);
      if (nameMatch) setUserName(nameMatch[1]);
    }
    if (data.careerPathways?.[0]) {
      setStudentType(data.careerPathways[0].title);
    }
    // Navigate to dashboard — it will load the latest from DB
    router.push('/dashboard');
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
              <span className="text-xl font-bold tracking-tight hidden sm:block">CareerX</span>
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

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-4">
            <Clock className="w-3 h-3" />
            Report History
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-zinc-50 tracking-tight mb-2">Your past reports</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-lg">All your previously generated career dashboards, saved automatically.</p>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-400 dark:text-zinc-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 mb-3">No reports yet</h2>
            <p className="text-slate-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">Complete the onboarding flow to generate your first personalised career dashboard.</p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:-translate-y-0.5"
            >
              <RotateCcw className="w-4 h-4" />
              Generate my first report
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {reports.map((report, i) => {
                const data = report.data as DashboardData;
                const title = data.careerPathways?.[0]?.title || 'Career Report';
                const summary = data.profileSummary?.slice(0, 120) + '...' || 'Personalised career analysis';

                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex items-center gap-5 p-6 bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => handleLoad(report)}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-zinc-50 truncate">{title}</h3>
                        {i === 0 && (
                          <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 uppercase tracking-wide">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-zinc-400 truncate">{summary}</p>
                      <p className="text-xs text-slate-400 dark:text-zinc-600 mt-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(report.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                        disabled={deletingId === report.id}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 dark:text-zinc-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                      >
                        {deletingId === report.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
