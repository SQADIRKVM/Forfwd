'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DashboardData, Source } from '@/lib/schemas';
import {
    Target, GraduationCap, Building, Briefcase, TrendingUp, MessageSquare,
    CheckCircle2, ArrowRight, ArrowLeft, Compass, Sparkles, RotateCcw, ChevronDown,
    ChevronUp, Bot, User, AlertTriangle, ExternalLink, Rocket, Network,
    BookOpen, Award, Search, Users, PenLine, ShieldCheck, Landmark,
    Link2, FileText, LineChart, FileCheck2, ArrowUp, X, Zap, Globe, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// ─── helpers ────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
    return <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold">{children}</span>;
}
function DemandBadge({ trend }: { trend: 'rising' | 'stable' | 'declining' }) {
    const m = { rising: { label: '↑ Rising', cls: 'text-emerald-700 bg-emerald-50 border-emerald-100' }, stable: { label: '→ Stable', cls: 'text-slate-500 bg-slate-50 border-slate-200' }, declining: { label: '↓ Declining', cls: 'text-rose-700 bg-rose-50 border-rose-100' } };
    const { label, cls } = m[trend] ?? m.stable;
    return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${cls}`}>{label}</span>;
}
function SourceBadge({ source }: { source: Source }) {
    return (
        <a href={source.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-bold rounded-md hover:bg-indigo-100 transition-colors">
            <Link2 className="w-2.5 h-2.5" />{source.domain || source.title.slice(0, 20)}
        </a>
    );
}
function PortalLink({ portal, url }: { portal: string; url: string }) {
    const colors: Record<string, string> = {
        LinkedIn: 'bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/20 hover:bg-[#0077B5]/20',
        Naukri: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
        Indeed: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
        Glassdoor: 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100',
    };
    const cls = colors[portal] ?? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
    return (
        <a href={url} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-colors shadow-sm ${cls}`}>
            <Search className="w-3 h-3" /> {portal}
        </a>
    );
}

function EmptyState({ title, message, icon: Icon }: { title: string; message: string; icon: any }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2.5rem] text-center space-y-4 group h-full min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-slate-300" />
            </div>
            <div>
                <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-2">{title}</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px] mx-auto">{message}</p>
            </div>
        </div>
    );
}

// ─── persona → sidebar nav items ────────────────────────────────────
function buildNavItems(cat: string, data: DashboardData) {
    const all = [
        { id: 'pathways', icon: Target, label: 'Career Pathways' },
        { id: 'education', icon: GraduationCap, label: 'Education' },
        { id: 'universities', icon: Building, label: 'Universities' },
        { id: 'jobs', icon: Briefcase, label: 'Job Market' },
        { id: 'ats', icon: FileCheck2, label: 'Resume ATS Scanner' },
        { id: 'skills', icon: TrendingUp, label: 'Skills & Roadmap' },
        { id: 'startup', icon: Rocket, label: 'Startup Resources' },
        { id: 'scholarships', icon: Award, label: 'Scholarships' },
        { id: 'bodies', icon: Landmark, label: 'Professional Bodies' },
        { id: 'sources', icon: Link2, label: 'Sources' },
        { id: 'advisory', icon: MessageSquare, label: 'AI Advisor' },
    ];
    const show: string[] = [];
    // pathways always
    show.push('pathways');
    // category-specific
    if (['student', 'parent', 'career_changer'].includes(cat)) { show.push('education', 'universities'); }
    if (['faculty', 'researcher'].includes(cat)) { show.push('education', 'universities', 'bodies'); }
    if (['healthcare', 'legal'].includes(cat)) { show.push('jobs', 'bodies'); }
    if (cat === 'founder') { show.push('startup'); }
    if (['student', 'parent'].includes(cat)) { show.push('scholarships'); }
    if (!show.includes('jobs')) { show.push('jobs'); }
    show.push('skills');
    if (data.sources?.length) { show.push('sources'); }
    show.push('ats'); // Always show ATS scanner
    show.push('advisory');
    return all.filter(n => show.includes(n.id));
}

// ─── Visual Explorer (Canvas) ────────────────────────────────────────
function VisualExplorer({ data, onNodeClick }: { data: DashboardData; onNodeClick: (pathway: any) => void }) {
    const pathways = data.careerPathways ?? [];
    
    // Generate positions for nodes on a canvas
    const nodes = useMemo(() => {
        return pathways.map((p, i) => {
            const angle = (i / pathways.length) * Math.PI * 2;
            const dist = 220 + Math.random() * 80; // Radius from center
            return {
                ...p,
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                scale: 0.9 + (p.matchPercentage / 100) * 0.3
            };
        });
    }, [pathways]);

    return (
        <div className="relative w-full h-[700px] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden cursor-grab active:cursor-grabbing shadow-[0_8px_40px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-[0.03]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Identity Node - Highly Visual */}
                <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="relative z-20 w-44 h-44 bg-white rounded-full shadow-[0_20px_50px_rgba(79,70,229,0.1)] border border-slate-100 flex flex-col items-center justify-center text-center p-6 group cursor-default"
                >
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                        <Compass className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Orbit</p>
                    <p className="text-xs font-bold text-slate-900 leading-tight">Match Intelligence</p>
                    <div className="absolute inset-0 rounded-full border border-indigo-100 animate-[ping_4s_linear_infinite] opacity-40" />
                </motion.div>

                {/* Pathway Nodes - Premium Interactive Bubbles */}
                {nodes.map((n, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: 1, 
                            scale: n.scale,
                            x: n.x,
                            y: n.y,
                        }}
                        transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
                        whileHover={{ scale: n.scale + 0.05, zIndex: 30, y: n.y - 10 }}
                        onClick={() => onNodeClick(n)}
                        className="absolute z-10 p-5 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_10px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.08)] hover:border-indigo-300 transition-all flex flex-col items-center gap-4 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                            <Target className="w-6 h-6 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                        <div className="text-center px-2">
                            <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{n.title}</p>
                            <div className="flex items-center justify-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${n.matchPercentage >= 90 ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{n.matchPercentage}% Match</p>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Canvas Controls Info */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-2.5 bg-slate-900 text-white rounded-full shadow-2xl text-[10px] font-bold uppercase tracking-widest z-40">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-slate-900 bg-indigo-500" />)}
                </div>
                <span>Click a node to map your journey</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
            </div>
        </div>
    );
}

function DeepDivePanel({ pathway, onClose, data }: { pathway: any; onClose: () => void; data: DashboardData }) {
    if (!pathway) return null;
    const srcMap = Object.fromEntries((data.sources ?? []).map(s => [s.id, s]));

    return (
        <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] z-[60] flex flex-col border-l border-slate-200 h-[100dvh] max-h-screen"
        >
            <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-slate-100 px-8 py-8 flex items-center justify-between z-20">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
                        <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{pathway.title}</h2>
                        <div className="flex items-center gap-3 mt-1">
                             <span className="text-sm font-bold text-indigo-600">{pathway.matchPercentage}% Match Index</span>
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{pathway.category}</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} 
                    className="group w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 hover:border-rose-100">
                    <X className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 pb-24">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Path Intelligence</h3>
                    </div>
                    <p className="text-base text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm">{pathway.reasoning}</p>
                </section>

                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><Briefcase className="w-3 h-3" /> Average Compensation</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{pathway.salaryRange}</p>
                        <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-tight">Competitive Global Rate</p>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-transform hover:-translate-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Industry Velocity</p>
                        <p className="text-2xl font-bold text-slate-900 tracking-tight">{pathway.marketDemand}</p>
                        <p className="text-[10px] text-indigo-600 font-bold mt-2 uppercase tracking-tight">High Future Potential</p>
                    </div>
                </div>

                <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 px-1">Critical Skill Stack</h3>
                    <div className="flex flex-wrap gap-3">
                        {pathway.requiredSkills?.map((s: string, j: number) => (
                            <span key={j} className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-2xl hover:bg-indigo-600 hover:text-white transition-all cursor-default shadow-sm">
                                {s}
                            </span>
                        ))}
                    </div>
                </section>

                {pathway.sourceIds?.length > 0 && (
                    <section className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6">Verified Intelligence Sources</h3>
                        <div className="flex flex-wrap gap-3">
                            {pathway.sourceIds.map((id: string) => srcMap[id] ? <SourceBadge key={id} source={srcMap[id]} /> : null)}
                        </div>
                    </section>
                )}

                <div className="pt-2 px-2 pb-10">
                    <Button className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-[1.5rem] shadow-xl shadow-indigo-200 flex items-center justify-center gap-4 group">
                        Map My Personalized Plan
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">Powered by Global Market Data & Real-time Trends</p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── section components ──────────────────────────────────────────────
function PathwaysSection({ data }: { data: DashboardData }) {
    const [open, setOpen] = useState<number | null>(0);
    const srcMap = useMemo(() => Object.fromEntries((data.sources ?? []).map(s => [s.id, s])), [data.sources]);
    if (!data.careerPathways?.length) return <EmptyState title="Strategic Pathways" message="No specific career trajectories synthesized yet." icon={Target} />;
    return (
        <div className="space-y-6">
            {data.careerPathways.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(79,102,241,0.05)] hover:border-indigo-200 transition-all">
                    <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-8 text-left group">
                        <div className="flex items-center gap-8 min-w-0 w-full pr-4">
                            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300">
                                <Target className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-4 mb-3">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{p.title}</h3>
                                    {p.category && <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 rounded-full border border-slate-200">{p.category}</span>}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                    <p className="text-sm font-bold text-indigo-600">{p.salaryRange}</p>
                                    <div className="hidden sm:block w-px h-4 bg-slate-100" />
                                    {/* Visual Match Bar */}
                                    <div className="flex items-center gap-4 max-w-sm flex-1">
                                        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-1000 shadow-sm ${
                                                    p.matchPercentage >= 90 ? 'bg-indigo-600' : 
                                                    p.matchPercentage >= 75 ? 'bg-emerald-500' : 
                                                    'bg-amber-500'
                                                }`}
                                                style={{ width: `${p.matchPercentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500 w-12">{p.matchPercentage}% Match</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${open === i ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                            {open === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                    </button>
                    <AnimatePresence>
                        {open === i && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3, ease: "circOut" }} className="overflow-hidden">
                                <div className="px-8 pb-8 border-t border-slate-50 pt-8 space-y-8 bg-slate-50/30">
                                    <p className="text-base text-slate-600 font-medium leading-relaxed max-w-4xl">{p.reasoning}</p>
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap className="w-3 h-3 text-indigo-500" /> Required Skill Stack</p>
                                            <div className="flex flex-wrap gap-2.5">{p.requiredSkills?.map((s, j) => (
                                                <span key={j} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-[11px] font-bold rounded-xl border border-slate-100">{s}</span>
                                            ))}</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><TrendingUp className="w-3 h-3 text-emerald-500" /> Market Intelligence</p>
                                            <p className="text-sm text-slate-600 font-bold leading-relaxed">{p.marketDemand}</p>
                                        </div>
                                    </div>
                                    {p.sourceIds?.length && (
                                        <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100/50">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest self-center mr-2">Verified Sources:</span>
                                            {p.sourceIds.map(id => srcMap[id] ? <SourceBadge key={id} source={srcMap[id]} /> : null)}
                                        </div>
                                    )}
                                    <div className="pt-4">
                                        <Button className="h-12 px-8 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-100 group">
                                            Deep Dive Into This Path
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
}

function EducationSection({ data }: { data: DashboardData }) {
    const degrees = data.education?.degrees ?? [];
    const certs = data.education?.certifications ?? [];
    if (!degrees.length && !certs.length) return <EmptyState title="Learning Pathways" message="No specific degree or certification data generated for this path." icon={GraduationCap} />;
    return (
        <div className="space-y-12">
            {degrees.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-indigo-600" /> Academic Programs</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {degrees.map((d, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-base font-bold text-slate-900 leading-tight">{d.field}</h3>
                                    <span className="shrink-0 px-2.5 py-1 text-[10px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg uppercase tracking-wider">{d.level}</span>
                                </div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">{d.description}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{d.duration}</span>
                                    {d.applyUrl && (
                                        <a href={d.applyUrl} target="_blank" rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
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
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-600" /> Professional Certifications</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {certs.map((c, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all flex flex-col gap-4">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">{c.name}</h4>
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider">{c.provider}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed border-l-2 border-emerald-500/20 pl-4 flex-1">{c.relevance}</p>
                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {c.estimatedHours && <span className="flex items-center gap-1.5"><RotateCcw className="w-3 h-3" /> {c.estimatedHours}</span>}
                                    {c.cost && <span>{c.cost}</span>}
                                </div>
                                {c.courseUrl && (
                                    <a href={c.courseUrl} target="_blank" rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-100 transition-colors">
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
                <motion.div key={i} whileHover={{ y: -5 }} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-indigo-200 group">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
                        <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm relative group-hover:bg-indigo-600 transition-colors duration-500">
                            <Building className="w-10 h-10 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <div className="flex-1 text-center lg:text-left min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight lg:mb-2">{u.name}</h3>
                                    <div className="flex items-center justify-center lg:justify-start gap-3">
                                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <Globe className="w-3.5 h-3.5" /> {u.location}
                                         </div>
                                         {u.scholarshipAvailable && <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-widest">Scholarships</span>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">World Rank</p>
                                        <p className="text-base font-bold text-slate-900">#{u.ranking}</p>
                                    </div>
                                    <div className="w-px h-8 bg-slate-200/50" />
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Fees</p>
                                        <p className="text-base font-bold text-slate-900">{u.averageFees}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mb-8">
                                {u.topPrograms?.map((p, j) => (
                                    <span key={j} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                                        {p}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {u.applicationDeadline && (
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center lg:justify-start gap-2.5 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500" /> 
                                        Intake: <span className="text-slate-900 font-bold">{u.applicationDeadline}</span>
                                    </p>
                                )}
                                {u.websiteUrl && (
                                    <a href={u.websiteUrl} target="_blank" rel="noopener noreferrer"
                                        className="h-12 inline-flex items-center gap-2.5 px-6 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
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
                <motion.div key={i} whileHover={{ y: -5 }} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-indigo-200 group">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-10">
                        <div className="flex items-center gap-8">
                            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-500 shadow-sm">
                                <Briefcase className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-4 mb-2">
                                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{job.role}</h3>
                                    <DemandBadge trend={job.demandTrend} />
                                </div>
                                <p className="text-sm text-slate-500 font-bold tracking-tight uppercase">Basis: <span className="text-indigo-600">{job.relatedDegree}</span></p>
                            </div>
                        </div>
                        <div className="shrink-0 bg-slate-50 border border-slate-100 rounded-[1.5rem] p-6 text-center flex flex-col gap-1 min-w-[180px]">
                            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Global Entry Avg</p>
                            <div className="text-2xl font-bold text-slate-900 tracking-tight">{job.entrySalary}</div>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-slate-50">
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-indigo-500" /> Industry Velocity
                            </p>
                            <p className="text-base text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50">{job.growthPath}</p>
                        </div>
                        <div className="space-y-6">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" /> Success Competencies
                            </p>
                            <div className="flex flex-wrap gap-2.5">
                                {job.skillsRequired.map((s, j) => (
                                    <span key={j} className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm hover:border-indigo-300 transition-colors">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {job.jobPortalLinks?.length && (
                        <div className="mt-10 pt-10 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center gap-6">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect to Market:</p>
                            <div className="flex flex-wrap gap-3">
                                {job.jobPortalLinks.map((l, j) => (
                                    <a key={j} href={l.url} target="_blank" rel="noopener noreferrer" 
                                        className="inline-flex items-center gap-2.5 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
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

function SkillsSection({ data }: { data: DashboardData }) {
    const skill = data.skillGaps;
    if (!skill || (!skill.currentSkills?.length && !skill.neededSkills?.length)) 
        return <EmptyState title="Capability Hub" message="No intelligence mapping available for current skills." icon={Target} />;
    return (
        <div className="space-y-16">
            <div className="grid md:grid-cols-2 gap-10">
                <motion.div whileHover={{ y: -5 }} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_4px_25px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -mr-12 -mt-12 opacity-50 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Mastered Competencies</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {skill.currentSkills.map((s, i) => (
                            <span key={i} className="px-5 py-2.5 bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold rounded-2xl transition-all hover:border-emerald-200">
                                {s}
                            </span>
                        ))}
                    </div>
                </motion.div>
                
                <motion.div whileHover={{ y: -5 }} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_4px_25px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -mr-12 -mt-12 opacity-50 transition-opacity group-hover:opacity-100" />
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm">
                            <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">High-Priority Gaps</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {skill.neededSkills.map((s, i) => (
                            <span key={i} className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold rounded-2xl shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
                                {s}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
            
            {skill.roadmap?.length > 0 && (
                <div className="pt-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-12 tracking-tight flex items-center gap-4 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        Strategic Capability Roadmap
                    </h2>
                    <div className="relative pl-10 border-l-2 border-slate-100 space-y-16 ml-4">
                        {skill.roadmap.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative">
                                <div className="absolute -left-[51px] top-0 w-5 h-5 rounded-full bg-white border-4 border-indigo-600 shadow-lg" />
                                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all">
                                    <div className="flex items-center gap-6 mb-10">
                                        <span className="inline-flex px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg shadow-indigo-100">{m.year}</span>
                                        <h4 className="text-2xl font-bold text-slate-900 tracking-tight">{m.title}</h4>
                                    </div>
                                    <div className="grid lg:grid-cols-2 gap-12">
                                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Execution Focus</p>
                                            <div className="flex flex-wrap gap-2.5">
                                                {m.focusAreas.map((a, j) => (
                                                    <span key={j} className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                                                        {a}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">KPIs & Milestones</p>
                                            <ul className="space-y-4">
                                                {m.milestones.map((ml, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-[13px] text-slate-600 font-bold leading-snug group/ml">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-200 mt-1.5 shrink-0 group-hover/ml:bg-indigo-600 transition-colors" />
                                                        {ml}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    {m.resourceLinks?.length && (
                                        <div className="mt-10 pt-8 border-t border-slate-50 flex flex-wrap items-center gap-6">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended Training Assets:</p>
                                            <div className="flex flex-wrap gap-3">
                                                {m.resourceLinks.map((r, j) => (
                                                    <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2.5 px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                                                        <ExternalLink className="w-3.5 h-3.5" /> {r.label}
                                                    </a>
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
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-6">Startup Resources</h3>
            {items.map((r, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-indigo-200 group flex items-start gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Zap className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{r.name}</h3>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{r.type}</p>
                            </div>
                            <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{r.location}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{r.description}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${r.applicationOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.applicationOpen ? 'Active Intake' : 'Registration Closed'}</span>
                             </div>
                             {r.url && (
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
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
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-6">Scholarships</h3>
            {items.map((s, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-indigo-200 group flex items-start gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 shadow-sm">
                        <GraduationCap className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{s.name}</h3>
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">{s.provider}</p>
                            </div>
                            <div className="text-xl font-bold text-indigo-600 tracking-tight shrink-0">{s.amount}</div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{s.eligibility}</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <ArrowRight className="w-3 h-3 text-indigo-600" /> Intake: {s.deadline}
                             </span>
                             {s.url && (
                                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1.5 uppercase tracking-widest">
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
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-6">Professional Intake</h3>
            {items.map((b, i) => (
                <motion.div key={i} whileHover={{ x: 5 }} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] transition-all hover:border-indigo-200 group flex items-start gap-8">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                        <ShieldCheck className="w-7 h-7 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{b.name}</h3>
                            <span className="shrink-0 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{b.country}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{b.description}</p>
                        {b.membershipUrl && (
                            <a href={b.membershipUrl} target="_blank" rel="noopener noreferrer" className="pt-6 border-t border-slate-50 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                                Membership Intelligence <ExternalLink className="w-3 h-3" />
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
        <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-6">Research Nodes</h3>
            <div className="grid sm:grid-cols-2 gap-6">
            {sources.map((s, i) => (
                <motion.a key={i} href={s.url} target="_blank" rel="noopener noreferrer" whileHover={{ y: -4 }}
                    className="flex flex-col p-8 bg-white border border-slate-200 rounded-[2rem] hover:border-indigo-200 hover:shadow-xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50/30 rounded-full blur-xl -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors duration-300">
                            <Link2 className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Market Intelligence Node</span>
                    </div>
                    <div className="flex-1 mb-8">
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-4 line-clamp-2 leading-tight">{s.title}</h4>
                        {s.snippet && <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">{s.snippet}</p>}
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                         <p className="text-[10px] font-bold text-indigo-400 truncate uppercase tracking-tighter max-w-[200px]">{s.domain || "Reference"}</p>
                         <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                </motion.a>
            ))}
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
        <div className="flex flex-col h-[75vh] bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden relative">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />
            
            <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-950 text-white flex items-center justify-center shadow-xl rotate-3"><Bot className="w-7 h-7" /></div>
                    <div>
                        <h4 className="text-xl font-bold text-slate-900 tracking-tight">AI Strategic Advisor</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Systems Active</span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
                    <Sparkles className="w-3.5 h-3.5" /> High Fidelity Mode
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide pb-40">
                {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'assistant' && (
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                <Bot className="w-5 h-5" />
                            </div>
                        )}
                        <div className={`max-w-[80%] px-8 py-6 rounded-[2rem] text-[15px] leading-relaxed font-medium whitespace-pre-wrap shadow-sm border ${msg.role === 'user' ? 'bg-slate-900 text-white border-slate-800 rounded-tr-none' : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'}`}>
                            {msg.role === 'assistant' && !msg.content ? (
                                <div className="flex gap-2 py-2">
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '200ms' }} />
                                    <div className="w-2 h-2 rounded-full bg-slate-200 animate-bounce" style={{ animationDelay: '400ms' }} />
                                </div>
                            ) : msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="shrink-0 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                    </motion.div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="sticky bottom-0 inset-x-0 p-8 z-30 bg-white/80 backdrop-blur-md border-t border-slate-100">
                 {messages.length <= 1 && (
                    <div className="flex flex-wrap gap-3 mb-8 justify-center">
                        {quickPrompts.map((q, i) => (
                            <button key={i} onClick={() => send(q)} 
                                className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md transition-all">
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
                            className="w-full bg-white border border-slate-200 rounded-2xl px-8 py-5 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 resize-none transition-all pr-12 shadow-sm" 
                        />
                        <Sparkles className="absolute right-4 w-5 h-5 text-slate-200 pointer-events-none" />
                    </div>
                    <Button onClick={() => send()} disabled={!input.trim() || loading} className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 disabled:opacity-20 transition-all shadow-xl active:scale-95 shrink-0">
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowUp className="w-6 h-6" />}
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
            alert("Scanner failure. System reset recommended.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
            {/* Input Side */}
            <div className="p-10 lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30 flex flex-col space-y-10">
                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">Diagnostic Tool</div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
                        <FileText className="w-7 h-7 text-indigo-600" />
                        ATS Compatibility Scan
                    </h3>
                    <p className="text-base text-slate-500 font-medium mt-4 leading-relaxed">Cross-reference your current profile assets against algorithmic hiring patterns.</p>
                </div>
                
                <div className="space-y-4 flex-1 flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Profile/Resume Data</label>
                    <textarea 
                        value={resume} onChange={e => setResume(e.target.value)}
                        placeholder="Paste your resume content or LinkedIn profile summary here for analysis..."
                        className="flex-1 w-full bg-white border border-slate-200 rounded-3xl p-8 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:ring-8 focus:ring-indigo-50/50 focus:border-indigo-600 resize-none transition-all shadow-sm"
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6 items-end">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target Market Role</label>
                        <select 
                            value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 cursor-pointer shadow-sm appearance-none"
                        >
                            {data.jobs?.map((j, i) => (
                                <option key={i} value={j.role}>{j.role}</option>
                            ))}
                        </select>
                    </div>
                    <Button 
                        onClick={handleScan} disabled={!resume.trim() || loading || !data.jobs?.length}
                        className="h-14 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold antialiased shadow-xl disabled:opacity-20 transition-all active:scale-95"
                    >
                        {loading ? <span className="flex items-center gap-3"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</span> : 'Run Diagnostics'}
                    </Button>
                </div>
            </div>

            {/* Result Side */}
            <div className="p-10 lg:w-1/2 bg-white flex flex-col relative group">
                {!result && !loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] transition-colors group-hover:border-indigo-100">
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                            <LineChart className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Analytical Readiness</h4>
                        <p className="text-base font-medium text-slate-400 max-w-xs leading-relaxed">Initiate a scan to receive compatibility scoring, keyword optimization, and strategic feedback.</p>
                    </div>
                ) : loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-10">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 border-[6px] border-slate-50 rounded-full" />
                            <div className="absolute inset-0 border-[6px] border-indigo-600 rounded-full border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Search className="w-10 h-10 text-indigo-600 animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-900 tracking-tight uppercase">Decrypting Algorithms</p>
                            <p className="text-sm text-slate-400 font-bold mt-2 animate-pulse">Mapping resume entities to industry schemas...</p>
                        </div>
                    </div>
                ) : result ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex flex-col items-center">
                            <div className="relative flex items-center justify-center">
                                <svg className="w-56 h-56 transform -rotate-90">
                                    <circle cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="16" className="text-slate-50" />
                                    <circle cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="16" strokeDasharray={628.3} strokeDashoffset={628.3 - (628.3 * result.matchScore) / 100} className={result.matchScore >= 80 ? 'text-indigo-600' : result.matchScore >= 60 ? 'text-amber-500' : 'text-rose-500'} strokeLinecap="round" />
                                </svg>
                                <div className="absolute flex flex-col items-center text-center">
                                    <span className="text-6xl font-bold tracking-tighter text-slate-900">{result.matchScore}%</span>
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2">Match Fidelity</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center"><ArrowRight className="w-3.5 h-3.5" /></div>
                                Optimization Gaps
                            </h4>
                            {result.missingKeywords.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {result.missingKeywords.map((k, i) => (
                                        <span key={i} className="px-5 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-xs shadow-sm hover:scale-105 transition-transform">{k}</span>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-[15px] flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-6 h-6" /></div>
                                    Resume architecture optimized for ATS.
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group/feedback hover:shadow-inner transition-all">
                            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20 group-hover/feedback:opacity-100 transition-opacity"><Sparkles className="w-8 h-8 text-indigo-400" /></div>
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">Strategic Feedback</h4>
                            <p className="text-[15px] text-slate-600 leading-relaxed font-bold antialiased">{result.feedback}</p>
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
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100">
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center gap-2 sticky top-0 z-50">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg transform -rotate-3"><Compass className="w-5 h-5 text-white" /></div>
                <span className="text-xl font-black tracking-tight text-slate-900 antialiased">CareerX</span>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center px-6">
                <div className="w-full max-w-sm text-center">
                    <div className="relative w-24 h-24 mx-auto mb-10">
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                        <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <div className="absolute inset-6 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center shadow-inner"><Sparkles className="w-5 h-5 text-indigo-600" /></div>
                    </div>
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-indigo-100 bg-white mb-6 text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm"><Sparkles className="w-3 h-3 animate-pulse" /> AI Intelligence Running</div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2 antialiased">Generating your report</h2>
                    <p className="text-slate-500 text-sm font-medium mb-10">Searching 100+ sources. This takes about 30–60 seconds.</p>
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 text-left overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600/10"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${(stage + 1) * 20}%` }} /></div>
                        {stages.map((s, i) => (
                            <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${i < stage ? 'opacity-40' : i === stage ? 'opacity-100' : 'opacity-20'}`}>
                                <div className="w-6 h-6 shrink-0 flex items-center justify-center">{i < stage ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : i === stage ? <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}</div>
                                <span className={`text-sm font-bold antialiased ${i === stage ? 'text-indigo-600' : i < stage ? 'text-slate-400' : 'text-slate-300'}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <button 
                    onClick={onStop} 
                    className="mt-10 px-8 py-3 rounded-2xl border-2 border-rose-200 text-rose-600 font-bold text-sm bg-white hover:bg-rose-50 hover:border-rose-300 transition-all flex items-center gap-2 active:scale-95"
                >
                    <X className="w-4 h-4" /> Stop Generation
                </button>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const [error, setError] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [selectedPathway, setSelectedPathway] = useState<any>(null);

    // Simple top Pill state
    const [topTab, setTopTab] = useState<'identity' | 'explore' | 'advisor'>('explore');

    useEffect(() => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const fetchDashboardData = async () => {
            const storedAnswers = localStorage.getItem('questionnaire_answers');
            const type = localStorage.getItem('student_type');
            const name = localStorage.getItem('user_name');
            const location = localStorage.getItem('user_location') || 'Global';
            const currency = localStorage.getItem('user_currency') || 'USD';
            if (!storedAnswers || !type) { router.push('/'); return; }
            try {
                const res = await fetch('/api/generate-dashboard', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ answers: JSON.parse(storedAnswers), studentType: type, userName: name, location, currency }),
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
            } catch (err: any) { 
                if (!controller.signal.aborted) {
                    setError(true); 
                    setLoading(false);
                }
            }
        };

        fetchDashboardData();

        return () => {
            controller.abort();
        };
    }, [router]);

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        router.push('/');
    };

    const detectedCat = useMemo(() => {
        const raw = (typeof window !== 'undefined' ? localStorage.getItem('student_type') : '') ?? '';
        const t = raw.toLowerCase();
        if (/\b(hod|head of dep|professor|lecturer|faculty|teacher|dean)\b/.test(t)) return 'faculty';
        if (/\b(founder|ceo|cto|startup|entrepreneur)\b/.test(t)) return 'founder';
        if (/\b(parent|father|mother|guardian)\b/.test(t)) return 'parent';
        if (/\b(researcher|phd|postdoc|scientist)\b/.test(t)) return 'researcher';
        if (/\b(doctor|nurse|physician|healthcare|medical)\b/.test(t)) return 'healthcare';
        if (/\b(lawyer|attorney|legal|judge)\b/.test(t)) return 'legal';
        if (/\b(student|learner|undergrad|studying)\b/.test(t)) return 'student';
        return 'professional';
    }, []);

    const navItems = useMemo(() => data ? buildNavItems(detectedCat, data) : [], [data, detectedCat]);

    if (loading) return <LoadingScreen onStop={handleStop} />;
    if (error || !data) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-sm w-full shadow-lg">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-8 h-8 text-rose-500" /></div>
                <h1 className="text-2xl font-black text-slate-900 mb-3">Analysis Failed</h1>
                <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed">We couldn't generate your report. This might be a temporary connection issue.</p>
                <Button onClick={() => window.location.reload()} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"><RotateCcw className="w-4 h-4" /> Try Again</Button>
            </div>
        </div>
    );

    const name = typeof window !== 'undefined' ? localStorage.getItem('user_name') : null;
    const sectionContent: Record<string, React.ReactNode> = {
        pathways: <PathwaysSection data={data} />, education: <EducationSection data={data} />,
        universities: <UniversitiesSection data={data} />, jobs: <JobsSection data={data} />,
        ats: <AtsScannerSection data={data} />,
        skills: <SkillsSection data={data} />, startup: <StartupSection data={data} />,
        scholarships: <ScholarshipsSection data={data} />, bodies: <BodiesSection data={data} />,
        sources: <SourcesSection data={data} />, advisory: <AdvisorySection data={data} />,
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 antialiased">
            {/* Academic Nav */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-sm transition-transform group-hover:rotate-6">
                                <Compass className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">CareerX</span>
                        </Link>
                        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
                        <button onClick={() => router.back()} className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </div>

                    {/* Top Pill Navigation - Simplified & Refined */}
                    <div className="hidden lg:flex items-center bg-slate-100 rounded-full p-1 border border-slate-200 overflow-hidden">
                        {[
                            { id: 'explore', label: 'Explore Paths', icon: Sparkles },
                            { id: 'advisor', label: 'AI Advisor', icon: Bot },
                            { id: 'identity', label: 'My Report', icon: FileText },
                        ].map(item => {
                            const Icon = item.icon;
                            const active = topTab === item.id;
                            return (
                                <button key={item.id} onClick={() => setTopTab(item.id as any)} 
                                    className={`flex items-center gap-2.5 px-6 py-2 rounded-full text-xs font-semibold transition-all ${active ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-indigo-600'}`}>
                                    <Icon className="w-3.5 h-3.5" /> {item.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => window.print()}
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors no-print"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export PDF
                        </button>
                        <div className="hidden md:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Edition</span>
                            <span className="text-[10px] font-bold text-indigo-600/60 uppercase tracking-widest mt-1">2025 Intelligence</span>
                        </div>
                        {name && <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-white shadow-sm no-print">{name.charAt(0).toUpperCase()}</div>}
                    </div>
                </nav>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-10 md:px-12">
                {/* Hero / Identity Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                    className="mb-16 bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-[100px] opacity-60 -mr-40 -mt-20 pointer-events-none" />
                    
                    <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-8 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5" /> High Fidelity Profile Created
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight leading-[1.1]">
                                {detectedCat === 'student' ? "Ignite Your Career" : "Map Your Next Chapter"},<br />
                                <span className="text-indigo-600">{name || 'Explorer'}</span>.
                            </h1>
                            <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mb-10">{data.profileSummary}</p>
                            
                            <div className="flex flex-wrap gap-4 items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Profile Basis:</span>
                                {data.sources?.slice(0, 4).map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition-colors hover:border-indigo-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                        {s.domain || "External Link"}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto">
                             <Button onClick={() => router.push('/questionnaire')} 
                                className="h-14 px-8 rounded-2xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl hover:shadow-slate-200 flex items-center justify-center gap-3">
                                <RotateCcw className="w-4 h-4" /> Reset Profile
                             </Button>
                             <div className="p-6 bg-white border border-slate-200 rounded-2xl text-center shadow-sm flex-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Global Match Score</div>
                                <div className="text-4xl font-bold text-indigo-600">98%</div>
                             </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12">
                    <AnimatePresence mode="wait">
                        {topTab === 'explore' && (
                            <motion.div key="explore" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Explore Your Future Orbit</h2>
                                    <p className="text-slate-500 font-medium">Interact with the nodes to discover detailed pathways and market intelligence.</p>
                                </div>
                                <VisualExplorer data={data} onNodeClick={setSelectedPathway} />
                                <div className="mt-16">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8 text-center bg-slate-50 py-4 rounded-full border border-slate-100">Recommended Path Segments</h3>
                                    <PathwaysSection data={data} />
                                </div>
                            </motion.div>
                        )}

                        {topTab === 'identity' && (
                            <motion.div key="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }} className="space-y-24 pb-24">
                                {/* The Journey: Education & Roadmap */}
                                <section id="roadmap">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                        <div className="max-w-2xl">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">Phase 01: Preparation</div>
                                            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">Your Academic & Skill Roadmap</h2>
                                            <p className="text-lg text-slate-500 font-medium leading-relaxed">A structured plan to bridge your current skills with industry demands.</p>
                                        </div>
                                    </div>
                                    <SkillsSection data={data} />
                                    <div className="mt-16">
                                        <EducationSection data={data} />
                                    </div>
                                </section>

                                {/* The Destination: Job Market */}
                                <section id="jobs" className="pt-24 border-t border-slate-200">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                                        <div className="max-w-2xl">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">Phase 02: Launch</div>
                                            <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">Real-world Job Analysis</h2>
                                            <p className="text-lg text-slate-500 font-medium leading-relaxed">Specific roles, salary benchmarks, and market trends for your target industry.</p>
                                        </div>
                                    </div>
                                    <JobsSection data={data} />
                                </section>

                                {/* Academic Infrastructure: Universities & More */}
                                <section id="resources" className="pt-24 border-t border-slate-200">
                                    <div className="mb-12">
                                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">Global Academic Network</h2>
                                        <p className="text-lg text-slate-500 font-medium leading-relaxed">Top institutions and ecosystems that align with your career velocity.</p>
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

                                {/* Intelligence Tool: ATS Scanner */}
                                <section id="ats" className="pt-24 border-t border-slate-200">
                                    <div className="mb-12">
                                        <h2 className="text-4xl font-bold text-slate-900 tracking-tighter mb-4">ATS Intelligence Hub</h2>
                                        <p className="text-lg text-slate-500 font-medium leading-relaxed">Optimize your profile for modern applicant tracking systems.</p>
                                    </div>
                                    <AtsScannerSection data={data} />
                                </section>
                            </motion.div>
                        )}

                        {topTab === 'advisor' && (
                            <motion.div key="advisor" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }}>
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">AI Career Concierge</h2>
                                    <p className="text-slate-500 font-medium">Real-time guidance on your roadmap, questions, or specific pivots.</p>
                                </div>
                                <AdvisorySection data={data} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <DeepDivePanel pathway={selectedPathway} onClose={() => setSelectedPathway(null)} data={data} />

            {/* Sticky Navigation Guard */}
            <div className="h-20" />
        </div>
    );
}
