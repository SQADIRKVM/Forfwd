'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardData, Source } from '@/lib/schemas';
import {
    Target, GraduationCap, Building, Briefcase, TrendingUp,
    CheckCircle2, ArrowRight, ArrowLeft, Compass, Sparkles, RotateCcw,
    Bot, User, AlertTriangle, ExternalLink, Network,
    BookOpen, Award, Search, ShieldCheck,
    Link2, FileText, LineChart, ArrowUp, X, Zap, Globe, Download, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getLatestReportAction, getAllReportsAction, updateReportMilestonesAction, deleteAllUserReportsAction } from '@/app/actions/report';
import { addCourseAction, getTrackedCoursesAction } from '@/app/actions/trackedCourse';
import { UserAccountNav } from '@/components/shared/UserAccountNav';
import { authClient } from '@/lib/auth/client';
import { AuthModal } from '@/components/shared/AuthModal';
import { LearningHub } from '@/components/dashboard/LearningHub';
import { MOCK_EXAMPLE_DATA } from '@/lib/mockReport';

// ─── helpers ────────────────────────────────────────────────────────

function DemandBadge({ trend }: { trend: 'rising' | 'stable' | 'declining' }) {
    const m = { 
        rising: { label: '↑ Rising', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }, 
        stable: { label: '→ Stable', cls: 'text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800/50 border-slate-200 dark:border-white/10' }, 
        declining: { label: '↓ Declining', cls: 'text-rose-500 dark:text-rose-400 bg-rose-500/10 border-rose-500/20' } 
    };
    const { label, cls } = m[trend] ?? m.stable;
    return <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${cls}`}>{label}</span>;
}
function SourceBadge({ source }: { source: Source }) {
    return (
        <a href={source.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-300 text-[10px] font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-all">
            <Link2 className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />{source.domain || source.title.slice(0, 20)}
        </a>
    );
}


function EmptyState({ title, message, icon: Icon }: { title: string; message: string; icon: React.ElementType }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-zinc-900/20 border border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] text-center space-y-4 group h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-300">
                <Icon className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-2">{title}</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 font-medium leading-relaxed max-w-[200px] mx-auto">{message}</p>
            </div>
        </div>
    );
}

function compactText(text: string, max = 120) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= max) return cleaned;
    return `${cleaned.slice(0, max).replace(/\s+\S*$/, '')}...`;
}

function formatLakhs(value: string) {
    const numeric = Number(value.replace(/,/g, ''));
    if (!Number.isFinite(numeric) || numeric <= 0) return value;
    if (numeric >= 100000) {
        const lakhs = numeric / 100000;
        return `${Number.isInteger(lakhs) ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
    }
    return value;
}

function compensationSummary(text: string) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned) return 'Compensation data unavailable';
    if (/variable|equity|founder|cto|startup/i.test(cleaned)) {
        return 'Variable: equity-first, growth-stage cash upside.';
    }
    const range = cleaned.match(/INR\s*([0-9,]+)\s*[-–]\s*([0-9,]+)/i);
    if (range) return `Entry: INR ${formatLakhs(range[1])}-${formatLakhs(range[2])} P.A.`;
    const firstSentence = cleaned.match(/^[^.]+[.]/)?.[0]?.replace(/\.$/, '');
    return compactText(firstSentence || cleaned, 58);
}

function marketDemandSummary(text: string) {
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned) return 'Market signal unavailable';
    if (/rising|grow|high|booming|strong/i.test(cleaned)) return 'High demand with strong growth.';
    if (/stable|steady/i.test(cleaned)) return 'Stable demand with steady hiring.';
    if (/declin|low|limited/i.test(cleaned)) return 'Selective demand; niche positioning matters.';
    return compactText(cleaned, 56);
}

interface PivotResult {
    compatibilityScore: number;
    transferableSkills: string[];
    newSkillsNeeded: string[];
    transitionPlan: Array<{
        phase: string;
        timeline: string;
        actions: string[];
    }>;
}

function PivotSandbox({ currentPath }: { currentPath: string }) {
    const [targetRole, setTargetRole] = useState('');
    const [simulating, setSimulating] = useState(false);
    const [result, setResult] = useState<PivotResult | null>(null);

    const handleSimulate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetRole.trim()) return;
        setSimulating(true);
        try {
            const res = await fetch('/api/simulate-pivot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPath, targetRole })
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
            } else {
                toast("Pivot simulation failed. Please try again.", "error");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSimulating(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-zinc-900/20 p-6 md:p-8 shadow-sm mb-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">Sandbox Mode</div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Interactive Career Explorer</h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Calculate transferable skills and bridge gaps to any alternative career target instantly.</p>
                </div>
                <form onSubmit={handleSimulate} className="flex gap-2.5 shrink-0 max-w-md w-full">
                    <input 
                        type="text"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="e.g. DevOps Engineer or Product Manager"
                        className="flex-1 h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/35 text-slate-800 dark:text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={simulating || !targetRole.trim()}
                        className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                        {simulating ? (
                            <>
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-3.5 h-3.5" />
                                Explore Shift
                            </>
                        )}
                    </button>
                </form>
            </div>

            {result && (
                <div className="grid md:grid-cols-3 gap-8 p-6 rounded-2xl bg-white dark:bg-zinc-950/40 border border-slate-200 dark:border-white/5 shadow-inner animate-in fade-in duration-500">
                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5">
                        <div className="relative flex items-center justify-center mb-4">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="54" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-white/5" />
                                <circle cx="64" cy="64" r="54" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={339.3} strokeDashoffset={339.3 - (339.3 * result.compatibilityScore) / 100} className="text-indigo-500" strokeLinecap="round" />
                            </svg>
                            <div className="absolute text-3xl font-black text-slate-800 dark:text-white">{result.compatibilityScore}%</div>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Transferability Match</h4>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">Transferable Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.transferableSkills.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-3">New Required Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.newSkillsNeeded.map((s, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">My 3-Year Transition Path</p>
                            <div className="grid sm:grid-cols-3 gap-4">
                                {result.transitionPlan.map((p, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/25">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <p className="text-[10px] font-black uppercase text-indigo-500">{p.timeline}</p>
                                        </div>
                                        <h5 className="text-xs font-black text-slate-800 dark:text-white mb-2 leading-tight">{p.phase}</h5>
                                        <ul className="space-y-1.5">
                                            {p.actions.map((act, j) => (
                                                <li key={j} className="text-[10px] text-slate-500 dark:text-zinc-400 font-semibold leading-snug">• {act}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


// ─── Visual Explorer (Canvas) ────────────────────────────────────────
function VisualExplorer({ data, onNodeClick }: { data: DashboardData; onNodeClick: (pathway: NonNullable<DashboardData['careerPathways']>[number]) => void }) {
    const pathways = useMemo(() => data.careerPathways ?? [], [data.careerPathways]);
    const sortedPathways = useMemo(
        () => [...pathways].sort((a, b) => b.matchPercentage - a.matchPercentage),
        [pathways]
    );

    return (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#101010] p-3 shadow-sm md:p-5">
            <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="relative grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sortedPathways.map((pathway, i) => (
                    <motion.button
                        key={`${pathway.title}-${i}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => onNodeClick(pathway)}
                        className={`group flex min-h-[260px] min-w-0 flex-col overflow-hidden rounded-xl border p-5 text-left transition-all hover:-translate-y-1 md:min-h-[280px] ${
                            i === 0
                                ? 'border-emerald-500/30 bg-[linear-gradient(135deg,rgba(16,185,129,0.1),rgba(240,255,245,0.9))] dark:bg-[linear-gradient(135deg,rgba(16,185,129,0.16),rgba(20,20,20,0.82))] hover:border-emerald-400/60 xl:col-span-1'
                                : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/70 hover:border-indigo-400/50 hover:bg-slate-100 dark:hover:bg-zinc-900'
                        }`}
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${i === 0 ? 'border-emerald-500/30 bg-emerald-500/15' : 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 group-hover:bg-indigo-500'}`}>
                                <Target className={`h-5 w-5 ${i === 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-400 dark:text-zinc-400 group-hover:text-white'}`} />
                            </div>
                            <div className="shrink-0 text-right">
                                <span className={`rounded-md px-2.5 py-1 text-[11px] font-black ${i === 0 ? 'bg-emerald-300 text-black' : 'bg-white text-black'}`}>{pathway.matchPercentage}%</span>
                                {i === 0 && <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-300">Best fit</p>}
                            </div>
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="mb-3 line-clamp-2 break-words text-lg font-bold leading-tight text-slate-800 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-100 md:text-xl">{pathway.title}</h4>
                            <p className="line-clamp-4 break-words text-sm font-medium leading-relaxed text-slate-500 dark:text-zinc-400">{pathway.reasoning}</p>
                        </div>
                        <div className="mt-6 min-w-0 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-black/25 p-3">
                            <div className="mb-3 grid gap-3 sm:grid-cols-[0.8fr_1.2fr]">
                                <div className="min-w-0">
                                    <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-600">Category</p>
                                    <p className="truncate text-xs font-bold text-slate-600 dark:text-zinc-300">{pathway.category || 'Career path'}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-600">Compensation</p>
                                    <p className="line-clamp-2 break-words text-xs font-bold leading-snug text-slate-600 dark:text-zinc-300">{compensationSummary(pathway.salaryRange)}</p>
                                </div>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-white/5">
                                <div
                                    className={`h-full rounded-full ${pathway.matchPercentage >= 90 ? 'bg-emerald-400' : pathway.matchPercentage >= 75 ? 'bg-indigo-400' : 'bg-amber-400'}`}
                                    style={{ width: `${pathway.matchPercentage}%` }}
                                />
                            </div>
                        </div>
                    </motion.button>
                ))}
                {!sortedPathways.length && (
                    <div className="md:col-span-2 xl:col-span-3">
                        <EmptyState title="Pathways" message="No pathway data available yet." icon={Compass} />
                    </div>
                )}
            </div>
        </div>
    );
}

function DeepDivePanel({ pathway, onClose, onPlanClick, data }: { pathway: NonNullable<DashboardData['careerPathways']>[number] | null; onClose: () => void; onPlanClick: (pathway: NonNullable<DashboardData['careerPathways']>[number]) => void; data: DashboardData }) {
    if (!pathway) return null;
    const srcMap = Object.fromEntries((data.sources ?? []).map(s => [s.id, s]));
    const visibleSkills = pathway.requiredSkills?.slice(0, 10) ?? [];
    const hiddenSkillCount = Math.max((pathway.requiredSkills?.length ?? 0) - visibleSkills.length, 0);

    return (
        <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-[60] flex h-[100dvh] max-h-screen min-h-0 w-full max-w-2xl flex-col border-l border-slate-200 dark:border-white/10 bg-white/98 dark:bg-[#080808]/96 text-slate-900 dark:text-zinc-100 shadow-xl backdrop-blur-2xl"
        >
            <div className="shrink-0 border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#080808]/90 px-5 py-5 backdrop-blur-xl md:px-7">
                <div className="flex min-w-0 items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.18)]">
                            <Target className="h-6 w-6 text-indigo-300" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="line-clamp-2 break-words text-2xl font-bold leading-tight tracking-tight text-slate-800 dark:text-white">{pathway.title}</h2>
                            <div className="mt-2 flex min-w-0 flex-wrap items-center gap-2">
                                <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-300">{pathway.matchPercentage}% Match</span>
                                {pathway.category && <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-zinc-500">{pathway.category}</span>}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} 
                        className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-rose-500/20 hover:bg-rose-500/10">
                        <X className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-rose-400" />
                    </button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-7">
                <div className="space-y-6 pb-10">
                    <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] p-5">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                                <Sparkles className="h-4 w-4 text-indigo-400" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">Why This Fits</h3>
                        </div>
                        <p className="line-clamp-6 break-words text-sm font-medium leading-relaxed text-slate-600 dark:text-zinc-300">{pathway.reasoning}</p>
                    </section>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="min-w-0 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/70 p-5">
                            <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-zinc-500">
                                <Briefcase className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-300" /> Compensation
                            </p>
                            <p className="text-base font-bold leading-snug text-slate-800 dark:text-white">{compensationSummary(pathway.salaryRange)}</p>
                        </div>
                        <div className="min-w-0 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/70 p-5">
                            <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-zinc-500">
                                <TrendingUp className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-300" /> Market Demand
                            </p>
                            <p className="text-base font-bold leading-snug text-slate-800 dark:text-white">{marketDemandSummary(pathway.marketDemand)}</p>
                        </div>
                    </div>

                    <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.03] p-5">
                        <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">Skill Stack</h3>
                        <div className="flex flex-wrap gap-2">
                            {visibleSkills.map((s: string, j: number) => (
                                <span key={j} className="max-w-full truncate rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-zinc-300">
                                    {s}
                                </span>
                            ))}
                            {hiddenSkillCount > 0 && (
                                <span className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-black text-indigo-300">
                                    +{hiddenSkillCount} more
                                </span>
                            )}
                        </div>
                    </section>

                    {(pathway.sourceIds?.length ?? 0) > 0 && (
                        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                            <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Sources</h3>
                            <div className="flex flex-wrap gap-2">
                                {pathway.sourceIds?.map((id: string) => srcMap[id] ? <SourceBadge key={id} source={srcMap[id]} /> : null)}
                            </div>
                        </section>
                    )}

                    <Button onClick={() => onPlanClick(pathway)} className="h-12 w-full rounded-xl bg-white text-sm font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:bg-zinc-200">
                        Map My Personalized Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ─── section components ──────────────────────────────────────────────
function EducationSection({ data }: { data: DashboardData }) {
    const degrees = data.education?.degrees ?? [];
    const certs = data.education?.certifications ?? [];
    if (!degrees.length && !certs.length) return <EmptyState title="Learning Pathways" message="No specific degree or certification data generated for this path." icon={GraduationCap} />;
    return (
        <div className="space-y-12">
            {degrees.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Academic Programs</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {degrees.map((d, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-lg hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-base font-bold text-slate-800 dark:text-white leading-tight">{d.field}</h3>
                                    <span className="shrink-0 px-2.5 py-1 text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg uppercase tracking-wider">{d.level}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed flex-1">{d.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/5">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{d.duration}</span>
                                    {d.applyUrl && (
                                        <a href={d.applyUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                                            Apply / Info <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
            {certs.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> Professional Certifications</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {certs.map((c, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-lg hover:border-slate-300 dark:hover:border-white/10 transition-all flex flex-col gap-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{c.name}</h4>
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{c.provider}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium leading-relaxed border-l-2 border-emerald-500/20 pl-4 flex-1">{c.relevance}</p>
                                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    {c.estimatedHours && <span className="flex items-center gap-1.5"><RotateCcw className="w-3 h-3" /> {c.estimatedHours}</span>}
                                    {c.cost && <span>{c.cost}</span>}
                                </div>
                                {c.courseUrl && (
                                    <a href={c.courseUrl} target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer">
                                        <BookOpen className="w-4 h-4" /> View Course
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function UniversitiesSection({ data }: { data: DashboardData }) {
    if (!data.topUniversities?.length) return <EmptyState title="University Ecosystem" message="No institutional matches identified for this path." icon={Building} />;
    return (
        <div className="space-y-12">
            {data.topUniversities.map((u, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-sm dark:shadow-lg transition-all hover:border-slate-300 dark:hover:border-white/10 group">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                        <div className="w-20 h-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-sm relative group-hover:bg-indigo-600 transition-colors duration-500">
                             <Building className="w-9 h-9 text-indigo-400 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="flex-1 text-center lg:text-left min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight lg:mb-2">{u.name}</h3>
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                         <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                            <Globe className="w-3.5 h-3.5 text-indigo-400" /> {u.location}
                                         </div>
                                         {u.scholarshipAvailable && <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Scholarships</span>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-6 bg-slate-100 dark:bg-[#0c0c0c] p-4 rounded-2xl border border-slate-200 dark:border-white/5">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">World Rank</p>
                                        <p className="text-base font-bold text-slate-800 dark:text-white">#{u.ranking}</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest mb-1">Avg. Fees</p>
                                        <p className="text-base font-bold text-slate-800 dark:text-white">{u.averageFees}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-8">
                                {u.topPrograms?.map((p, j) => (
                                    <span key={j} className="px-4 py-2 bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-300 text-xs font-bold rounded-xl shadow-sm hover:border-indigo-500/30 transition-colors">
                                        {p}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {u.applicationDeadline && (
                                    <p className="text-xs font-bold text-slate-500 dark:text-zinc-500 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2.5 bg-slate-100 dark:bg-[#0c0c0c] px-4 py-2 rounded-full border border-slate-200 dark:border-white/5">
                                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse" /> 
                                        Intake: <span className="text-slate-800 dark:text-white font-bold">{u.applicationDeadline}</span>
                                    </p>
                                )}
                                {u.websiteUrl && (
                                    <a href={u.websiteUrl} target="_blank" rel="noopener noreferrer"
                                        className="h-11 inline-flex items-center gap-2.5 px-6 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all shadow-md dark:shadow-lg cursor-pointer">
                                        Visit Institution <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function JobsSection({ data }: { data: DashboardData }) {
    if (!data.jobs?.length) return <EmptyState title="Employment Analytics" message="No specific job openings or market data found." icon={Briefcase} />;
    return (
        <div className="space-y-12">
            {data.jobs.map((job, i) => (
                <motion.div key={i} whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-lg transition-all hover:border-slate-300 dark:hover:border-white/10 group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-10">
                        <div className="flex items-center gap-8">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-500 shadow-sm">
                                <Briefcase className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{job.role}</h3>
                                    <DemandBadge trend={job.demandTrend} />
                                </div>
                                <p className="text-xs font-black tracking-wider uppercase text-zinc-500">Basis: <span className="text-indigo-400">{job.relatedDegree}</span></p>
                            </div>
                        </div>
                        <div className="shrink-0 bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-6 text-center flex flex-col gap-1 min-w-[180px]">
                            <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-zinc-500 tracking-widest">Global Entry Avg</p>
                            <div className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">{job.entrySalary}</div>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-slate-200 dark:border-white/5">
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-400" /> Industry Velocity
                            </p>
                            <p className="text-sm text-slate-500 dark:text-zinc-300 leading-relaxed font-medium bg-slate-100 dark:bg-[#0c0c0c] p-6 rounded-2xl border border-slate-200 dark:border-white/5">{job.growthPath}</p>
                        </div>
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-400" /> Success Competencies
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {job.skillsRequired.map((s, j) => (
                                    <span key={j} className="px-3.5 py-1.5 bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-300 text-xs font-bold rounded-xl shadow-sm hover:border-indigo-500/30 transition-colors">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {job.jobPortalLinks?.length && (
                        <div className="mt-10 pt-10 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-6">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Connect to Market:</p>
                            <div className="flex flex-wrap gap-2.5">
                                {job.jobPortalLinks.map((l, j) => (
                                    <a key={j} href={l.url} target="_blank" rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-2.5 h-10 px-5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer">
                                        <ExternalLink className="w-3.5 h-3.5" /> {l.portal}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
}

function SkillsSection({ data, completedMilestones = [], onToggleMilestone, trackedUrls = [], onAddTrackedUrl }: { data: DashboardData; completedMilestones?: string[]; onToggleMilestone?: (id: string) => void; trackedUrls?: string[]; onAddTrackedUrl?: (url: string) => void }) {
    const skill = data.skillGaps;
    if (!skill || (!skill.currentSkills?.length && !skill.neededSkills?.length)) 
        return <EmptyState title="Capability Hub" message="No intelligence mapping available for current skills." icon={Target} />;
    return (
        <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-10">
                <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-lg relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/10 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">Mastered Competencies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {skill.currentSkills.map((s, i) => (
                            <span key={i} className="px-4 py-2.5 bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all hover:border-emerald-500/30 cursor-default">
                                {s}
                            </span>
                        ))}
                    </div>
                </motion.div>
                
                <motion.div whileHover={{ y: -5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-lg relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/10 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -mr-12 -mt-12 pointer-events-none" />
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-sm">
                            <Target className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest">High-Priority Gaps</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        {skill.neededSkills.map((s, i) => (
                            <span key={i} className="px-4 py-2.5 bg-slate-100 dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/5 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl transition-all hover:border-indigo-500/30 cursor-default">
                                {s}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
            
            {skill.roadmap?.length > 0 && (
                <div className="pt-8">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 tracking-tight flex items-center gap-4 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white text-slate-800 dark:text-black flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        My Career Roadmap
                    </h2>

                    {/* Interactive Completion Progress Bar */}
                    {onToggleMilestone && (
                        <div className="mb-12 p-6 bg-slate-100/50 dark:bg-zinc-900/30 border border-slate-200 dark:border-white/5 rounded-2xl shadow-sm">
                            <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-zinc-400 mb-2.5">
                                <span>Roadmap Execution Progress</span>
                                <span className="text-indigo-600 dark:text-indigo-400">
                                    {Math.round((completedMilestones.filter(m => skill.roadmap.some(r => `${r.year}-${r.title}` === m)).length / skill.roadmap.length) * 100)}%
                                </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                                <div 
                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                    style={{ 
                                        width: `${(completedMilestones.filter(m => skill.roadmap.some(r => `${r.year}-${r.title}` === m)).length / skill.roadmap.length) * 100}%` 
                                    }} 
                                />
                            </div>
                        </div>
                    )}

                    <div className="relative pl-10 border-l-2 border-indigo-500/20 space-y-16 ml-4">
                        {skill.roadmap.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                                <div className={`absolute -left-[51px] top-1.5 w-5 h-5 rounded-full border-4 shadow-sm transition-all duration-300 ${
                                    completedMilestones.includes(`${m.year}-${m.title}`)
                                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                                        : 'bg-slate-50 dark:bg-black border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                                }`} />
                                <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-lg hover:border-slate-300 dark:hover:border-white/10 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                                        <div className="flex items-center gap-6">
                                            <span className="inline-flex px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-wider">{m.year}</span>
                                            <h4 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{m.title}</h4>
                                        </div>
                                        {onToggleMilestone && (
                                            <button 
                                                onClick={() => onToggleMilestone(`${m.year}-${m.title}`)}
                                                className={`flex items-center gap-2.5 h-10 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                                    completedMilestones.includes(`${m.year}-${m.title}`)
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 shadow-sm'
                                                        : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-white/5 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10'
                                                }`}
                                            >
                                                {completedMilestones.includes(`${m.year}-${m.title}`) ? (
                                                    <>
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-zinc-700" />
                                                        Mark Done
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid lg:grid-cols-2 gap-8">
                                        <div className="p-8 bg-slate-100 dark:bg-[#0c0c0c] rounded-[2rem] border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-6">Execution Focus</p>
                                            <div className="flex flex-wrap gap-2">
                                                {m.focusAreas.map((a, j) => (
                                                    <span key={j} className="text-xs font-bold text-slate-600 dark:text-zinc-300 bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-lg">
                                                        {a}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-8 bg-slate-100 dark:bg-[#0c0c0c] rounded-[2rem] border border-slate-200 dark:border-white/5">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-6">KPIs &amp; Milestones</p>
                                            <ul className="space-y-4">
                                                {m.milestones.map((ml, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-[13px] text-slate-500 dark:text-zinc-400 font-bold leading-snug group/ml">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 mt-1.5 shrink-0 group-hover/ml:bg-indigo-400 transition-colors" />
                                                        {ml}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {m.resourceLinks?.length && (
                                        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center gap-6">
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider shrink-0">Recommended Training Assets:</p>
                                            <div className="flex flex-wrap gap-4">
                                                {m.resourceLinks.map((r, j) => (
                                                    <div key={j} className="flex items-center gap-2">
                                                        <a href={r.url} target="_blank" rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2.5 h-10 px-5 bg-white hover:bg-zinc-200 text-black rounded-xl text-xs font-bold transition-all shadow-lg cursor-pointer">
                                                            <ExternalLink className="w-3.5 h-3.5" /> {r.label}
                                                        </a>
                                                        {trackedUrls.includes(r.url) ? (
                                                            <div className="h-10 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-default select-none">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tracked
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={async () => {
                                                                    const platform = r.url.toLowerCase().includes('youtube') 
                                                                        ? 'youtube' 
                                                                        : r.url.toLowerCase().includes('udemy') 
                                                                        ? 'udemy' 
                                                                        : r.url.toLowerCase().includes('coursera') 
                                                                        ? 'coursera' 
                                                                        : 'other';
                                                                    try {
                                                                        const res = await addCourseAction(r.label, platform, r.url);
                                                                        if (res.success) {
                                                                            toast(`"${r.label}" has been added to My Learning Hub! Set schedules, watch study videos, and track progress there.`, "success");
                                                                            if (onAddTrackedUrl) onAddTrackedUrl(r.url);
                                                                        } else {
                                                                            toast(res.error || "Failed to add course", "error");
                                                                        }
                                                                    } catch (err) {
                                                                        console.error(err);
                                                                    }
                                                                }}
                                                                className="h-10 px-3 bg-indigo-500/10 hover:bg-indigo-500 text-indigo-600 dark:text-indigo-400 hover:text-white border border-indigo-500/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95"
                                                                title="Track this course in My Learning Hub"
                                                            >
                                                                <Plus className="w-3.5 h-3.5" /> Track
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function StartupSection({ data }: { data: DashboardData }) {
    const items = data.startupResources ?? [];
    if (!items.length) return <EmptyState title="Startup Ecosystem" message="No relevant startup resources found for this path." icon={Zap} />;
    return (
        <div className="space-y-6">
            {items.map((r, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-lg transition-all hover:border-slate-300 dark:hover:border-white/10 group flex items-start gap-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-sm">
                        <Zap className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                             <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{r.name}</h3>
                                <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mt-1">{r.type}</p>
                             </div>
                             <span className="shrink-0 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">{r.location}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed mb-6">{r.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${r.applicationOpen ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{r.applicationOpen ? 'Active Intake' : 'Registration Closed'}</span>
                             </div>
                             {r.url && (
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 uppercase tracking-widest cursor-pointer">
                                    Apply <ArrowRight className="w-3 h-3" />
                                </a>
                             )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function ScholarshipsSection({ data }: { data: DashboardData }) {
    const items = data.scholarships ?? [];
    if (!items.length) return <EmptyState title="Financial Support" message="No specific scholarships identified for this profile." icon={GraduationCap} />;
    return (
        <div className="space-y-6">
            {items.map((s, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-lg transition-all hover:border-slate-300 dark:hover:border-white/10 group flex items-start gap-8">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-sm">
                        <GraduationCap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                             <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{s.name}</h3>
                                <p className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider mt-1">{s.provider}</p>
                             </div>
                             <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight shrink-0">{s.amount}</div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed mb-6">{s.eligibility}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <ArrowRight className="w-3 h-3 text-indigo-400 animate-pulse" /> Intake: {s.deadline}
                             </span>
                             {s.url && (
                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 uppercase tracking-widest cursor-pointer">
                                    Apply <ArrowRight className="w-3 h-3" />
                                </a>
                             )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function BodiesSection({ data }: { data: DashboardData }) {
    const items = data.professionalBodies ?? [];
    if (!items.length) return <EmptyState title="Professional Bodies" message="No specific professional associations found." icon={ShieldCheck} />;
    return (
        <div className="space-y-6">
            {items.map((b, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 shadow-lg transition-all hover:border-slate-300 dark:hover:border-white/10 group flex items-start gap-8">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-sm">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                             <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">{b.name}</h3>
                             <span className="shrink-0 text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/5">{b.country}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium leading-relaxed mb-6">{b.description}</p>
                        {b.membershipUrl && (
                            <a href={b.membershipUrl} target="_blank" rel="noopener noreferrer" className="pt-6 border-t border-slate-200 dark:border-white/5 flex items-center gap-1.5 text-xs font-black text-indigo-500 hover:text-indigo-300 transition-colors uppercase tracking-widest cursor-pointer">
                                Membership Intelligence <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function SourcesSection({ data }: { data: DashboardData }) {
    const sources = data.sources ?? [];
    if (!sources.length) return <EmptyState title="Verified Sources" message="No direct research links extracted." icon={Link2} />;
    return (
        <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-zinc-950/50 p-5 md:p-6">
            <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">Sources</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">Evidence used for this report, shown as citation cards.</p>
                </div>
                <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-200/50 dark:bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-500">
                    {sources.length} refs
                </span>
            </div>

            <div className="grid gap-3">
            {sources.map((s, i) => {
                const domain = s.domain || (() => {
                    try { return new URL(s.url).hostname.replace(/^www\./, ''); } catch { return 'source'; }
                })();
                return (
                <motion.a key={s.id || i} href={s.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -2 }}
                    className="group flex min-w-0 gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.035] p-4 transition-all hover:border-indigo-400/35 dark:hover:border-indigo-400/35 hover:bg-slate-50 dark:hover:bg-white/[0.055]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-sm font-black text-indigo-600 dark:text-indigo-300">
                        {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex min-w-0 flex-wrap items-center gap-2">
                            <span className="max-w-[220px] truncate text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-300">{domain}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-600">Source</span>
                        </div>
                        <h4 className="line-clamp-2 break-words text-sm font-bold leading-snug text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-100">{s.title}</h4>
                        {s.snippet && (
                            <div className="mt-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/25 p-3">
                                <p className="mb-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-600">Excerpt</p>
                                <p className="line-clamp-3 break-words text-xs font-medium leading-relaxed text-slate-500 dark:text-zinc-400">{s.snippet}</p>
                            </div>
                        )}
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-indigo-300" />
                </motion.a>
            );})}
            </div>
        </div>
    );
}

function AdvisorySection({ data }: { data: DashboardData }) {
    type Message = { role: 'user' | 'assistant'; content: string };
    const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: "Systems initialized. I've synthesized your complete profile data. We can discuss velocity pivots, specific university comparisons, or deep-dive into skill acquisition roadmaps. Where should we start?" }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const quickPrompts = ["Highest ROI career pivot?", "University comparison deep-dive", "Next 90 days skill roadmap"];
    
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const send = async (msg?: string) => {
        const text = (msg ?? input).trim(); 
        if (!text || loading) return;
        const next = [...messages, { role: 'user' as const, content: text }];
        setMessages([...next, { role: 'assistant' as const, content: '' }]); 
        setInput(''); 
        setLoading(true);
        try {
            const res = await fetch('/api/chat', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    messages: next.map(m => ({ role: m.role, content: m.content })), 
                    context: { 
                        profileSummary: data.profileSummary, 
                        careerPathways: data.careerPathways, 
                        jobs: data.jobs, 
                        skillGaps: data.skillGaps 
                    } 
                }) 
            });
            if (!res.ok || !res.body) throw new Error('fail');
            const reader = res.body.getReader(); 
            const dec = new TextDecoder(); 
            let full = '';
            while (true) { 
                const { done, value } = await reader.read(); 
                if (done) break; 
                full += dec.decode(value, { stream: true }); 
                setMessages(prev => { 
                    const u = [...prev]; 
                    u[u.length - 1] = { role: 'assistant', content: full }; 
                    return u; 
                }); 
            }
        } catch { 
            setMessages(prev => { 
                const u = [...prev]; 
                u[u.length - 1] = { role: 'assistant', content: 'Agent communication failure. Please verify connection and retry.' }; 
                return u; 
            }); 
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="flex flex-col h-[75vh] bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm dark:shadow-2xl overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10" />
            
            <div className="flex items-center justify-between px-10 py-8 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center shadow-xl hover:rotate-6 transition-transform"><Bot className="w-6 h-6" /></div>
                    <div>
                        <h4 className="text-xl font-bold text-white tracking-tight">AI Career Advisor</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Systems Active</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" /> High Fidelity Mode
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide pb-40">
                {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400">
                                <Bot className="w-5 h-5" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-8 py-6 rounded-[2rem] text-[15px] leading-relaxed font-medium whitespace-pre-wrap border ${msg.role === 'user' ? 'bg-indigo-600/20 text-slate-800 dark:text-white border-indigo-500/30 rounded-tr-none' : 'bg-white dark:bg-zinc-900/40 text-slate-700 dark:text-zinc-100 border-slate-200 dark:border-white/5 rounded-tl-none'}`}>
                            {msg.role === 'assistant' && !msg.content ? (
                                <div className="flex gap-2 py-2">
                                    <div className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: '200ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-zinc-700 animate-bounce" style={{ animationDelay: '400ms' }} />
                                </div>
                            ) : msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                    </motion.div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 inset-x-0 p-8 z-30 bg-white/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md border-t border-slate-200 dark:border-white/5">
                 {messages.length <= 1 && (
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {quickPrompts.map((q, i) => (
                            <button key={i} onClick={() => send(q)} 
                                className="px-5 py-2.5 bg-slate-100 dark:bg-zinc-900/40 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 rounded-xl text-[11px] font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white transition-all cursor-pointer">
                                {q}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex gap-4 items-end max-w-4xl mx-auto">
                    <div className="flex-1 relative flex items-center">
                        <textarea 
                            value={input} onChange={e => setInput(e.target.value)} 
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} 
                            placeholder="Type an inquiry..." 
                            rows={1} 
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl px-8 py-5 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all pr-12" 
                        />
                        <Sparkles className="absolute right-4 w-5 h-5 text-zinc-700 pointer-events-none" />
                    </div>
                    <Button onClick={() => send()} disabled={!input.trim() || loading} className="w-14 h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black flex items-center justify-center disabled:opacity-20 transition-all shadow-xl active:scale-95 shrink-0 cursor-pointer">
                        {loading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <ArrowUp className="w-6 h-6" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ─── ATS Scanner Section ─────────────────────────────────────────────
function AtsScannerSection({ data }: { data: DashboardData }) {
    const [resume, setResume] = useState('');
    const [selectedJob, setSelectedJob] = useState(data.jobs?.[0]?.role ?? '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ matchScore: number; feedback: string; missingKeywords: string[] } | null>(null);
    const [optimizing, setOptimizing] = useState(false);
    const [optimizedResult, setOptimizedResult] = useState<{ optimizedResume: string; changesMade: string[] } | null>(null);

    const handleOptimize = async () => {
        if (!resume.trim() || !result) return;
        setOptimizing(true);
        try {
            const res = await fetch('/api/optimize-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeContent: resume, missingKeywords: result.missingKeywords })
            });
            const output = await res.json();
            if (output.success) {
                setOptimizedResult(output);
            } else {
                toast("Optimization failed. Please try again.", "error");
            }
        } catch (e) {
            console.error(e);
            toast("Optimizer error. Please try again.", "error");
        } finally {
            setOptimizing(false);
        }
    };

    const handleScan = async () => {
        if (!resume.trim() || !selectedJob) return;
        setLoading(true);
        try {
            const res = await fetch('/api/scan-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume, jobRole: selectedJob })
            });
            if (!res.ok) throw new Error('Failed to scan');
            const output = await res.json();
            setResult(output);
        } catch (e) {
            console.error(e);
            toast("Scanner failure. System reset recommended.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm dark:shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
            {/* Input Side */}
            <div className="p-10 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-[#0a0a0a]/50 flex flex-col space-y-10">
                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Diagnostic Tool</div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-4">
                        <FileText className="w-7 h-7 text-indigo-500 dark:text-indigo-400 animate-pulse" />
                        Resume Keyword Optimizer
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium mt-4 leading-relaxed">Cross-reference your current profile assets against algorithmic hiring patterns.</p>
                </div>
                
                <div className="space-y-4 flex-1 flex flex-col">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">Profile/Resume Data</label>
                    <textarea 
                        value={resume} onChange={e => setResume(e.target.value)}
                        placeholder="Paste your resume content or LinkedIn profile summary here for analysis..."
                        className="flex-1 w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 resize-none transition-all shadow-sm"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 items-end">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-wider ml-1">Target Market Role</label>
                        <select 
                            value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm appearance-none"
                        >
                            {data.jobs?.map((j, i) => (
                                <option key={i} value={j.role} className="bg-zinc-950 text-white">{j.role}</option>
                            ))}
                        </select>
                    </div>
                    <Button 
                        onClick={handleScan} disabled={!resume.trim() || loading || !data.jobs?.length}
                        className="h-14 rounded-2xl bg-white hover:bg-zinc-200 text-black font-black antialiased disabled:opacity-20 transition-all active:scale-95 cursor-pointer"
                    >
                        {loading ? <span className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Analyzing...</span> : 'Run Diagnostics'}
                    </Button>
                </div>
            </div>

            {/* Result Side */}
            <div className="p-10 lg:w-1/2 bg-slate-50 dark:bg-[#0c0c0c]/40 backdrop-blur-xl flex flex-col relative group">
                {optimizedResult ? (
                    <div className="space-y-8 w-full animate-in fade-in duration-500 flex flex-col h-full">
                        <div className="flex items-center justify-between">
                            <h4 className="text-lg font-black text-slate-800 dark:text-white">AI-Optimized Resume Diff</h4>
                            <button 
                                onClick={() => setOptimizedResult(null)}
                                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                            >
                                ← Back to Feedback
                            </button>
                        </div>

                        <div className="p-6 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl">
                            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3">Changes Made by AI:</p>
                            <ul className="list-disc pl-5 text-xs text-slate-600 dark:text-zinc-300 space-y-1 font-semibold">
                                {optimizedResult.changesMade.map((c, i) => (
                                    <li key={i}>{c}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 flex-1">
                            <div className="flex flex-col h-64 md:h-auto">
                                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Original</p>
                                <div className="flex-1 p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-black/35 text-xs text-slate-500 dark:text-zinc-400 overflow-y-auto font-mono whitespace-pre-wrap">
                                    {resume}
                                </div>
                            </div>
                            <div className="flex flex-col h-64 md:h-auto">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Optimized (ATS Approved)</p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(optimizedResult.optimizedResume);
                                            toast("Optimized resume copied to clipboard!", "success");
                                        }}
                                        className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                    >
                                        Copy to Clipboard
                                    </button>
                                </div>
                                <div className="flex-1 p-5 rounded-xl border border-indigo-500/30 bg-slate-100/50 dark:bg-black/35 text-xs text-slate-800 dark:text-white overflow-y-auto font-mono whitespace-pre-wrap">
                                    {optimizedResult.optimizedResume}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !result && !loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-12 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] transition-colors group-hover:border-slate-300 dark:group-hover:border-white/10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                            <LineChart className="w-8 h-8 text-slate-400 dark:text-zinc-600 animate-pulse" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-800 dark:text-white mb-4 tracking-tight">Analytical Readiness</h4>
                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-500 max-w-xs leading-relaxed">Initiate a scan to receive compatibility scoring, keyword optimization, and strategic feedback.</p>
                    </div>
                ) : loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                        <div className="relative w-28 h-28">
                            <div className="absolute inset-0 border-[6px] border-slate-200 dark:border-white/5 rounded-full" />
                            <div className="absolute inset-0 border-[6px] border-indigo-500 rounded-full border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="w-8 h-8 text-indigo-400 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800 dark:text-white tracking-tight uppercase">Decrypting Algorithms</p>
                            <p className="text-xs text-zinc-500 font-bold mt-2 animate-pulse">Mapping resume entities to industry schemas...</p>
                        </div>
                    </div>
                ) : result ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
                        <div className="flex flex-col items-center">
                            <div className="relative flex items-center justify-center">
                                <svg className="w-48 h-48 transform -rotate-90">
                                    <circle cx="96" cy="96" r="84" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-white/5" />
                                    <circle cx="96" cy="96" r="84" fill="transparent" stroke="currentColor" strokeWidth="12" strokeDasharray={527.7} strokeDashoffset={527.7 - (527.7 * result.matchScore) / 100} className={result.matchScore >= 80 ? 'text-indigo-500' : result.matchScore >= 60 ? 'text-amber-500' : 'text-rose-500'} strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center text-center">
                                    <span className="text-5xl font-bold tracking-tighter text-slate-800 dark:text-white">{result.matchScore}%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mt-2">Match Fidelity</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 flex items-center justify-center"><ArrowRight className="w-3.5 h-3.5" /></div>
                                    Optimization Gaps
                                </h4>
                                {result.missingKeywords.length > 0 && (
                                    <button
                                        onClick={handleOptimize}
                                        disabled={optimizing}
                                        className="h-9 px-4 rounded-lg bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all hover:bg-indigo-600 disabled:opacity-50 cursor-pointer"
                                    >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        {optimizing ? 'Optimizing...' : '⚡ Auto-Optimize'}
                                    </button>
                                )}
                            </div>
                            {result.missingKeywords.length > 0 ? (
                                <div className="flex flex-wrap gap-2.5">
                                    {result.missingKeywords.map((k, i) => (
                                        <span key={i} className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold text-xs shadow-sm hover:scale-105 transition-transform">{k}</span>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[14px] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-emerald-400" /></div>
                                    Resume architecture optimized for ATS.
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-100 dark:bg-zinc-900/60 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 relative overflow-hidden group/feedback hover:border-slate-300 dark:hover:border-white/10 transition-all">
                            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20 group-hover/feedback:opacity-100 transition-opacity"><Sparkles className="w-8 h-8 text-indigo-400" /></div>
                            <h4 className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-6 flex items-center gap-3">Advisor Feedback</h4>
                            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-bold antialiased">{result.feedback}</p>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

// ─── Loading Screen ──────────────────────────────────────────────────
function LoadingScreen({ onStop }: { onStop: () => void }) {
    const [stage, setStage] = useState(0);
    const stages = ['Parsing your profile...', 'Running search queries...', 'Analysing industry data...', 'Cross-referencing sources...', 'Building your roadmap...'];
    useEffect(() => { const t = [0, 2000, 4500, 7000, 9500].map((d, i) => setTimeout(() => setStage(i), d)); return () => t.forEach(clearTimeout); }, []);
    return (
        <div className="relative z-10 min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 flex flex-col font-sans selection:bg-indigo-100">
            <header className="w-full bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4 flex items-center gap-2 sticky top-0 z-50">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg transform -rotate-3"><Compass className="w-5 h-5 text-white" /></div>
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white antialiased">Forfwd</span>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md text-center">
                    {/* Simplified Big Interactive Loader */}
                    <div className="relative w-28 h-28 mx-auto mb-8">
                        <div className="absolute inset-0 border-8 border-slate-200 dark:border-zinc-800 rounded-full" />
                        <div className="absolute inset-0 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-4 bg-indigo-100 dark:bg-indigo-950 border-2 border-indigo-300 dark:border-indigo-800 rounded-full flex items-center justify-center shadow-md"><Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-pulse" /></div>
                    </div>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/80 mb-6 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider shadow-sm"><Sparkles className="w-4 h-4 animate-bounce" /> AI Engine Active</div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 antialiased">Generating your report</h2>
                    <p className="text-slate-600 dark:text-zinc-300 text-sm font-semibold mb-8">Searching 100+ sources. This takes about 30–60 seconds.</p>
                    
                    {/* Highly Visible List Box */}
                    <div className="bg-white dark:bg-zinc-900 border-4 border-slate-300 dark:border-zinc-700 rounded-3xl p-8 shadow-xl space-y-5 text-left overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 dark:bg-zinc-800"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(stage + 1) * 20}%` }} /></div>
                        {stages.map((s, i) => {
                            const isCompleted = i < stage;
                            const isActive = i === stage;
                            return (
                                <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${isCompleted ? 'opacity-100' : isActive ? 'opacity-100 scale-[1.02]' : 'opacity-60'}`}>
                                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-slate-50 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-transparent font-bold" />
                                        ) : isActive ? (
                                            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-zinc-600" />
                                        )}
                                    </div>
                                    <span className={`text-base font-bold antialiased ${
                                        isCompleted 
                                            ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                            : isActive 
                                                ? 'text-indigo-600 dark:text-indigo-400 font-black underline decoration-2' 
                                                : 'text-slate-500 dark:text-zinc-400 font-bold'
                                    }`}>{s}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Bold Stop Generation Button */}
                <button 
                    onClick={onStop} 
                    className="mt-10 px-10 py-4 rounded-2xl border-4 border-rose-500 hover:border-rose-600 text-rose-600 dark:text-rose-400 font-extrabold text-base bg-white dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-3 active:scale-95 shadow-md"
                >
                    <X className="w-5 h-5 font-bold" /> Stop Generation
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────
import { useOnboardingStore } from '@/lib/store';

function toast(message: string, type: 'success' | 'error' | 'info' = 'success') {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('toast', { detail: { message, type } }));
    }
}

interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function DashboardPage() {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    };

    useEffect(() => {
        const handleToastEvent = (e: Event) => {
            const customEvent = e as CustomEvent<{ message: string; type?: 'success' | 'error' | 'info' }>;
            if (customEvent.detail?.message) {
                addToast(customEvent.detail.message, customEvent.detail.type || 'success');
            }
        };
        window.addEventListener('toast', handleToastEvent);
        return () => window.removeEventListener('toast', handleToastEvent);
    }, []);
    
    // Read from Zustand store
    const storeAnswers = useOnboardingStore(state => state.questionnaireAnswers);
    const storeType = useOnboardingStore(state => state.studentType);
    const storeName = useOnboardingStore(state => state.userName);
    const storeLocation = useOnboardingStore(state => state.location);
    const storeCurrency = useOnboardingStore(state => state.currency);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [selectedPathway, setSelectedPathway] = useState<NonNullable<DashboardData['careerPathways']>[number] | null>(null);
    const [plannedPathway, setPlannedPathway] = useState<NonNullable<DashboardData['careerPathways']>[number] | null>(null);

    const [topTab, setTopTab] = useState<'identity' | 'explore' | 'advisor'>('explore');
    const [reportTab, setReportTab] = useState<'roadmap' | 'jobs' | 'network' | 'ats' | 'learning'>('roadmap');
    const [reportId, setReportId] = useState<string | null>(null);
    const [trackedUrls, setTrackedUrls] = useState<string[]>([]);

    useEffect(() => {
        async function fetchTracked() {
            try {
                const list = await getTrackedCoursesAction();
                setTrackedUrls(list.map((c: any) => c.url).filter((u: any) => !!u));
            } catch (err) {
                console.error(err);
            }
        }
        fetchTracked();
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const fetchDashboardData = async () => {
            try {
                // Check if user requested to view an example report
                const isExample = typeof window !== 'undefined' && window.location.search.includes('example=true');
                if (isExample) {
                    console.log('📝 Loading high-fidelity Mock Example Report');
                    setData(MOCK_EXAMPLE_DATA);
                    setLoading(false);
                    return;
                }

                // ── 1. Check Neon DB for existing report ─────────────────────
                const reports = await getAllReportsAction();
                if (reports.length > 0 && !controller.signal.aborted) {
                    console.log('✅ Found saved report in Neon');
                    setReportId(reports[0].id);
                    setData(reports[0].data as DashboardData);
                    setLoading(false);
                    return;
                }

                // ── 2. Fallback to AI generation ───────────────────────────
                const type = storeType;
                const name = storeName;
                const location = storeLocation || 'Global';
                const currency = storeCurrency || 'USD';
                
                if (Object.keys(storeAnswers).length === 0 || !type) { 
                    router.push('/onboarding'); 
                    return; 
                }

                const res = await fetch('/api/generate-dashboard', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 
                        answers: storeAnswers, 
                        studentType: type, 
                        userName: name, 
                        location, 
                        currency 
                    }),
                    signal: controller.signal
                });
                const result = await res.json();
                if (!controller.signal.aborted) {
                    if (result.status === 'complete' && result.data) { 
                        setData(result.data); 
                    } else { 
                        setError(true); 
                    }
                    setLoading(false);
                }
            } catch (err) { 
                if (!controller.signal.aborted) {
                    console.error('Fetch Dashboard Error:', err);
                    setError(true); 
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            controller.abort();
        };
    }, [router, storeAnswers, storeCurrency, storeLocation, storeName, storeType]);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        router.push('/');
    };

    const handlePlanClick = (pathway: NonNullable<DashboardData['careerPathways']>[number]) => {
        setPlannedPathway(pathway);
        setSelectedPathway(null);
        setTopTab('identity');
        window.setTimeout(() => {
            document.getElementById('roadmap')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 80);
    };

    const handleToggleMilestone = async (milestoneId: string) => {
        if (!data || !reportId) return;

        const currentMilestones = (data as any).completedMilestones || [];
        const isCompleted = currentMilestones.includes(milestoneId);
        
        const updatedMilestones = isCompleted
            ? currentMilestones.filter((id: string) => id !== milestoneId)
            : [...currentMilestones, milestoneId];

        const updatedData = {
            ...data,
            completedMilestones: updatedMilestones,
        };

        setData(updatedData);

        try {
            await updateReportMilestonesAction(reportId, updatedMilestones);
        } catch (err) {
            console.error("Failed to update milestone in database:", err);
        }
    };

    const detectedCat = useMemo(() => {
        const raw = storeType ?? '';
        const t = raw.toLowerCase();
        if (/\b(hod|head of dep|professor|lecturer|faculty|teacher|dean)\b/.test(t)) return 'faculty';
        if (/\b(founder|ceo|cto|startup|entrepreneur)\b/.test(t)) return 'founder';
        if (/\b(parent|father|mother|guardian)\b/.test(t)) return 'parent';
        if (/\b(researcher|phd|postdoc|scientist)\b/.test(t)) return 'researcher';
        if (/\b(doctor|nurse|physician|healthcare|medical)\b/.test(t)) return 'healthcare';
        if (/\b(lawyer|attorney|legal|judge)\b/.test(t)) return 'legal';
        if (/\b(student|learner|undergrad|studying)\b/.test(t)) return 'student';
        return 'professional';
    }, [storeType]);


    if (loading) return <LoadingScreen onStop={handleStop} />;
    if (error || !data) return (
        <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-zinc-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-10 text-center max-w-sm w-full shadow-lg">
                <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/20 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-8 h-8 text-rose-500 dark:text-rose-400" /></div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-50 mb-3">Analysis Failed</h1>
                <p className="text-slate-500 dark:text-zinc-400 text-sm mb-10 font-medium leading-relaxed">We couldn&apos;t generate your report. This might be a temporary connection issue.</p>
                <Button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"><RotateCcw className="w-4 h-4" /> Try Again</Button>
            </div>
        </div>
    );

    const strongestPath = data.careerPathways?.reduce((best, item) => item.matchPercentage > best.matchPercentage ? item : best, data.careerPathways[0]) ?? null;
    const summaryCards = [
        { label: 'Best match', value: strongestPath ? `${strongestPath.matchPercentage}%` : 'N/A', detail: strongestPath?.title ?? 'No path generated', icon: Target, tone: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' },
        { label: 'Career routes', value: String(data.careerPathways?.length ?? 0), detail: 'Ranked by fit and market context', icon: Network, tone: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' },
        { label: 'Skill gaps', value: String(data.skillGaps?.neededSkills?.length ?? 0), detail: 'Prioritized learning targets', icon: Zap, tone: 'text-amber-300 bg-amber-500/10 border-amber-500/20' },
        { label: 'Verified sources', value: String(data.sources?.length ?? 0), detail: 'Research links attached', icon: Link2, tone: 'text-sky-300 bg-sky-500/10 border-sky-500/20' },
    ];
    const topTabItems = [
        { id: 'explore' as const, label: 'Pathways', icon: Sparkles },
        { id: 'identity' as const, label: 'Report', icon: FileText },
        { id: 'advisor' as const, label: 'Advisor', icon: Bot },
    ];
    const topSources = data.sources?.slice(0, 3) ?? [];

    return (
        <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-[#080808] text-slate-900 dark:text-zinc-50 font-sans selection:bg-indigo-200 dark:selection:bg-emerald-500/25 antialiased">
            <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/92 dark:bg-[#080808]/92 backdrop-blur-xl">
                <nav className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-6">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="group flex items-center gap-3">
                            <img src="/banner.png" alt="Forfwd" className="h-15 w-auto object-contain transition-transform group-hover:scale-[1.02]" />
                        </Link>
                        <button onClick={() => router.back()} className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-xs font-bold text-slate-500 dark:text-zinc-400 transition-colors hover:text-slate-800 dark:hover:text-white sm:flex">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={async () => {
                                try {
                                    await deleteAllUserReportsAction();
                                    router.push('/questionnaire');
                                } catch (err) {
                                    console.error(err);
                                }
                            }} 
                            className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-300 transition-colors hover:bg-slate-200 dark:hover:bg-zinc-800 md:flex cursor-pointer"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Reset
                        </button>
                        <button 
                            onClick={() => window.print()}
                            className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-600 dark:text-zinc-300 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 md:flex no-print"
                        >
                            <Download className="h-3.5 w-3.5" />
                            Export PDF
                        </button>
                        <UserAccountNav />
                    </div>
                </nav>
            </header>

            {!session?.user && (
                <div className="mx-auto max-w-[1400px] px-4 pt-6 md:px-6">
                    <div className="relative overflow-hidden rounded-2xl border border-dashed border-indigo-600/30 bg-indigo-50/20 dark:bg-indigo-950/10 p-5 md:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 10% 20%, #4f46e5 0, transparent 40%)' }} />
                        <div className="flex items-start gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-indigo-950 dark:text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                                    💡 Guest Mode Enabled
                                </h3>
                                <p className="text-slate-600 dark:text-zinc-400 text-sm font-medium leading-relaxed max-w-3xl">
                                    You are viewing this generated career trajectory report as a guest. <strong>Create a free account or sign in</strong> to permanently save this dashboard, chat with your AI counselor, track courses, and scan resumes!
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                            <Zap className="w-4 h-4" /> Save This Report
                        </button>
                    </div>
                    <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
                </div>
            )}

            <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
                <main className="min-w-0">
                    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f] shadow-sm dark:shadow-[0_28px_80px_rgba(0,0,0,0.34)]">
                        <div className="relative">
                            <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(circle_at_20%_10%,#34d399_0,transparent_25%),radial-gradient(circle_at_85%_15%,#60a5fa_0,transparent_24%)]" />
                            <div className="relative border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.025] px-4 py-4 md:px-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                                            <Compass className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-base font-black text-slate-800 dark:text-white">Forfwd Study Hub</p>
                                            <p className="truncate text-[11px] font-bold text-zinc-500">{storeName || 'Explorer'} &middot; {detectedCat} profile</p>
                                        </div>
                                    </div>

                                    <div className="flex min-w-0 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/35 p-1">
                                        {topTabItems.map(item => {
                                            const Icon = item.icon;
                                            const active = topTab === item.id;
                                            return (
                                                <button key={item.id} onClick={() => setTopTab(item.id)} className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-xs font-bold transition-all ${active ? 'bg-white text-black shadow-lg' : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'}`}>
                                                    <Icon className="h-4 w-4" />
                                                    {item.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="relative grid gap-6 p-5 md:p-7 xl:grid-cols-[1fr_420px]">
                                <div className="min-w-0">
                                    <div className="mb-5 flex flex-wrap items-center gap-2">
                                        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Report Ready
                                        </div>
                                        {strongestPath && (
                                            <div className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/25 px-3 py-1.5 text-[11px] font-bold text-slate-600 dark:text-zinc-300">
                                                <Target className="h-3.5 w-3.5 shrink-0 text-emerald-500 dark:text-emerald-300" />
                                                <span className="truncate">Top path: {strongestPath.title}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h1 className="mb-5 max-w-4xl text-3xl font-bold leading-[1.05] tracking-tight text-slate-800 dark:text-white md:text-5xl">
                                        {detectedCat === 'student' ? 'Career roadmap' : 'Next chapter map'} for {storeName || 'Explorer'}
                                    </h1>
                                    <p className="max-w-4xl break-words text-base font-medium leading-relaxed text-slate-500 dark:text-zinc-300 md:text-lg">{data.profileSummary}</p>
                                    {topSources.length > 0 && (
                                        <div className="mt-6 flex min-w-0 flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600">Sources</span>
                                            {topSources.map((source) => (
                                                <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-[220px] items-center gap-2 truncate rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-zinc-300 transition-colors hover:border-sky-400/40 hover:text-slate-800 dark:hover:text-white">
                                                    <Link2 className="h-3.5 w-3.5 shrink-0 text-sky-300" />
                                                    <span className="truncate">{source.domain || source.title}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                                    {summaryCards.map(card => {
                                        const Icon = card.icon;
                                        return (
                                            <div key={card.label} className="min-w-0 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/30 p-4">
                                                <div className="mb-4 flex items-center justify-between gap-3">
                                                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${card.tone}`}>
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <p className="truncate text-2xl font-bold text-slate-800 dark:text-white">{card.value}</p>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">{card.label}</p>
                                                <p className="mt-1 line-clamp-2 break-words text-xs font-semibold leading-snug text-slate-500 dark:text-zinc-300">{card.detail}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    <div>
                    <AnimatePresence mode="wait">
                        {topTab === 'explore' && (
                            <motion.div key="explore" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                                <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white md:text-3xl">Career Pathways</h2>
                                        <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Ranked opportunities with salary, skill, and source context.</p>
                                    </div>
                                </div>
                                <PivotSandbox currentPath={plannedPathway?.title || data.careerPathways?.[0]?.title || ''} />
                                <VisualExplorer data={data} onNodeClick={setSelectedPathway} />
                            </motion.div>
                        )}

                        {topTab === 'identity' && (
                            <motion.div key="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }} className="space-y-12 pb-24">
                                {/* Beautiful Sub-Tab Controller */}
                                <div className="flex items-center justify-center">
                                    <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/90 dark:bg-zinc-900/60 border border-slate-200 dark:border-white/5 rounded-2xl backdrop-blur-md shadow-sm">
                                        {[
                                            { id: 'roadmap' as const, label: 'Roadmap & Gaps', icon: TrendingUp },
                                            { id: 'jobs' as const, label: 'Job Analytics', icon: Briefcase },
                                            { id: 'network' as const, label: 'Global Network', icon: GraduationCap },
                                            { id: 'ats' as const, label: 'Resume Optimizer', icon: FileText },
                                            { id: 'learning' as const, label: 'My Learning Hub', icon: BookOpen },
                                        ].map(st => {
                                            const Icon = st.icon;
                                            const active = reportTab === st.id;
                                            return (
                                                <button
                                                    key={st.id}
                                                    onClick={() => setReportTab(st.id)}
                                                    className={`flex items-center gap-2.5 h-10 px-5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                                                        active
                                                            ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-white shadow-md'
                                                            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                    {st.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {reportTab === 'roadmap' && (
                                        <motion.div key="roadmap" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.3 }}>
                                            <section id="roadmap">
                                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                                    <div className="max-w-2xl">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-4">Phase 01: Preparation</div>
                                                        <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">
                                                            {plannedPathway ? `Personalized Plan: ${plannedPathway.title}` : 'Your Academic & Skill Roadmap'}
                                                        </h2>
                                                        <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">
                                                            {plannedPathway
                                                                ? `Focused on this path's core gaps: ${(plannedPathway.requiredSkills ?? []).slice(0, 3).join(', ') || 'skills, experience, and market readiness'}.`
                                                                : 'A structured plan to bridge your current skills with industry demands.'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {plannedPathway && (
                                                    <div className="mb-12 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                            <div className="min-w-0">
                                                                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-300">Selected Career Path</p>
                                                                <p className="line-clamp-2 text-xl font-bold text-slate-800 dark:text-white">{plannedPathway.title}</p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {(plannedPathway.requiredSkills ?? []).slice(0, 4).map((skill) => (
                                                                    <span key={skill} className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/25 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-zinc-300">{skill}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                <SkillsSection 
                                                    data={data} 
                                                    completedMilestones={(data as any)?.completedMilestones || []} 
                                                    onToggleMilestone={handleToggleMilestone} 
                                                    trackedUrls={trackedUrls}
                                                    onAddTrackedUrl={(url) => setTrackedUrls(prev => [...prev, url])}
                                                />
                                                <div className="mt-16">
                                                    <EducationSection data={data} />
                                                </div>
                                            </section>
                                        </motion.div>
                                    )}

                                    {reportTab === 'jobs' && (
                                        <motion.div key="jobs" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.3 }}>
                                            <section id="jobs">
                                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                                    <div className="max-w-2xl">
                                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-4">Phase 02: Launch</div>
                                                        <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">Real-world Job Analysis</h2>
                                                        <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">Specific roles, salary benchmarks, and market trends for your target industry.</p>
                                                    </div>
                                                </div>
                                                <JobsSection data={data} />
                                            </section>
                                        </motion.div>
                                    )}

                                    {reportTab === 'network' && (
                                        <motion.div key="network" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.3 }}>
                                            <section id="resources">
                                                <div className="mb-12">
                                                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">Global Academic Network</h2>
                                                    <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">Top institutions and ecosystems that align with your career velocity.</p>
                                                </div>
                                                <div className="space-y-16">
                                                    <UniversitiesSection data={data} />
                                                    <div className="grid lg:grid-cols-2 gap-10">
                                                        <StartupSection data={data} />
                                                        <ScholarshipsSection data={data} />
                                                    </div>
                                                    <div className="grid lg:grid-cols-2 gap-10">
                                                        <BodiesSection data={data} />
                                                        <SourcesSection data={data} />
                                                    </div>
                                                </div>
                                            </section>
                                        </motion.div>
                                    )}

                                    {reportTab === 'ats' && (
                                        <motion.div key="ats" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.3 }}>
                                            <section id="ats">
                                                <div className="mb-12">
                                                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">Resume Optimizer Hub</h2>
                                                    <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">Optimize your profile keywords for modern job applications.</p>
                                                </div>
                                                <AtsScannerSection data={data} />
                                            </section>
                                        </motion.div>
                                    )}

                                    {reportTab === 'learning' && (
                                        <motion.div key="learning" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} transition={{ duration: 0.3 }}>
                                            <section id="learning">
                                                <div className="mb-12">
                                                    <h2 className="text-4xl font-bold text-slate-800 dark:text-white tracking-tight mb-4">My Personal Learning Hub</h2>
                                                    <p className="text-lg text-slate-500 dark:text-zinc-400 font-medium leading-relaxed">Track your Udemy and YouTube playlist progress alongside your study schedules.</p>
                                                </div>
                                                <LearningHub />
                                            </section>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {topTab === 'advisor' && (
                            <motion.div key="advisor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">AI Career Concierge</h2>
                                    <p className="text-slate-500 dark:text-zinc-400 font-medium">Real-time guidance on your roadmap, questions, or specific pivots.</p>
                                </div>
                                <AdvisorySection data={data} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                </main>
            </div>

            <DeepDivePanel pathway={selectedPathway} onClose={() => setSelectedPathway(null)} onPlanClick={handlePlanClick} data={data} />

            {/* Custom Toast Notification Stack */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                <AnimatePresence>
                    {toasts.map((t) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-xl border text-xs font-bold ${
                                t.type === 'success'
                                    ? 'bg-emerald-500/90 dark:bg-emerald-950/90 text-white border-emerald-400/20 backdrop-blur-md'
                                    : t.type === 'error'
                                    ? 'bg-rose-500/90 dark:bg-rose-950/90 text-white border-rose-400/20 backdrop-blur-md'
                                    : 'bg-indigo-500/90 dark:bg-indigo-950/90 text-white border-indigo-400/20 backdrop-blur-md'
                            }`}
                        >
                            <div className="flex-1 leading-snug">{t.message}</div>
                            <button onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))} className="text-white/60 hover:text-white shrink-0 cursor-pointer">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Sticky Navigation Guard */}
            <div className="h-20" />
        </div>
    );
}
