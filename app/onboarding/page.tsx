'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Compass, ArrowRight, ArrowLeft, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { UserAccountNav } from '@/components/shared/UserAccountNav';

const DEGREE_LEVELS = [
    "High school / GED equivalent",
    "Associate's degree",
    "Bachelor's degree",
    "Master's degree",
    "Doctorate or professional degree",
    "Professional certificate",
    "Vocational / technical certificate",
    "Other",
];

const STUDENT_KEYWORDS = ['student', 'learner', 'school', 'university', 'college', 'studying', 'undergrad', 'grad', 'pupil'];

import { useOnboardingStore } from '@/lib/store';

export default function OnboardingPage() {
    const router = useRouter();
    const setStoreUserName = useOnboardingStore(state => state.setUserName);
    const setStoreLocation = useOnboardingStore(state => state.setLocation);
    const setStoreCurrency = useOnboardingStore(state => state.setCurrency);
    const setStoreStudentType = useOnboardingStore(state => state.setStudentType);
    
    const [step, setStep] = useState<'name' | 'role' | 'location'>('name');
    const [name, setName] = useState('');
    const [roleInput, setRoleInput] = useState('');
    const [manualLocation, setManualLocation] = useState('');
    const [studentLevel, setStudentLevel] = useState('');
    const [subjectArea, setSubjectArea] = useState('');
    const [isLocating, setIsLocating] = useState(false);
    const roleRef = useRef<HTMLInputElement>(null);
    const isStudentContext = STUDENT_KEYWORDS.some(kw => roleInput.toLowerCase().includes(kw));

    useEffect(() => {
        if (!isStudentContext) { 
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStudentLevel(''); 
             
            setSubjectArea(''); 
        }
    }, [isStudentContext]);

    const handleNameSubmit = () => {
        if (name.trim()) {
            setStoreUserName(name.trim());
            setStep('role');
            setTimeout(() => roleRef.current?.focus(), 400);
        }
    };

    const fetchLocation = async (): Promise<boolean> => {
        try {
            const res = await fetch('https://ipapi.co/json/');
            const d = await res.json();
            if (d.country_name) {
                setStoreLocation(`${d.city ? d.city + ', ' : ''}${d.country_name}`);
                setStoreCurrency(d.currency || 'USD');
                return true;
            }
            return false;
        } catch { 
            return false;
        }
    };

    const handleContinue = async () => {
        if (!isValidRole()) return;
        let finalType = roleInput.trim();
        if (isStudentContext) {
            finalType = `Student — ${studentLevel || 'General'}, ${subjectArea || 'Undeclared'}`;
        }
        setIsLocating(true);
        const hasLocation = await fetchLocation();
        setIsLocating(false);
        
        if (!hasLocation) {
            setStep('location');
            return;
        }

        setStoreStudentType(finalType);
        router.push(`/questionnaire?type=${encodeURIComponent(finalType)}`);
    };

    const handleManualLocationSubmit = () => {
        if (!manualLocation.trim()) return;
        setStoreLocation(manualLocation.trim());
        setStoreCurrency('USD'); // default fallback
        
        let finalType = roleInput.trim();
        if (isStudentContext) {
            finalType = `Student — ${studentLevel || 'General'}, ${subjectArea || 'Undeclared'}`;
        }
        setStoreStudentType(finalType);
        router.push(`/questionnaire?type=${encodeURIComponent(finalType)}`);
    };

    const isValidRole = () => {
        if (!roleInput.trim()) return false;
        if (isStudentContext) return studentLevel.length > 0 && subjectArea.trim().length > 0;
        return true;
    };

    const progress = step === 'name' ? 33 : step === 'role' ? 66 : 100;

    return (
        <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-zinc-50 flex flex-col font-sans selection:bg-indigo-100">

            {/* Nav */}
            <header className="w-full bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 md:px-12">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center shadow-indigo-200 shadow-sm transition-transform group-hover:rotate-6">
                                <Compass className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 hidden sm:block">CareerX</span>
                        </Link>
                        <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />
                        <button onClick={() => router.back()} className="text-sm font-bold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    </div>
                    <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                        Step {step === 'name' ? '1' : step === 'role' ? '2' : '3'} of 3
                    </div>
                    <UserAccountNav />
                </nav>
            </header>

            {/* Progress bar */}
            <div className="w-full h-0.5 bg-slate-200">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-indigo-600"
                />
            </div>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <AnimatePresence mode="wait">
                    {step === 'name' ? (
                        <motion.div
                            key="name"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full max-w-xl"
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 mb-8 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                Getting started
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-4 leading-[1.1]">
                                What&apos;s your name?
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 font-medium mb-10">
                                We&apos;ll personalise everything just for you.
                            </p>

                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
                                placeholder="e.g. Haris Ahmed"
                                autoFocus
                                className="w-full text-2xl font-medium text-slate-900 dark:text-zinc-50 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent border-b-2 border-slate-200 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none py-3 transition-colors mb-3"
                            />
                            <p className="text-sm text-slate-400 dark:text-zinc-500 mb-12">Press Enter or click Continue</p>

                            <motion.div animate={{ opacity: name.trim() ? 1 : 0 }}>
                                <button
                                    onClick={handleNameSubmit}
                                    disabled={!name.trim()}
                                    className="h-14 px-8 rounded-full text-base font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-zinc-100 transition-all shadow-xl shadow-slate-200/50 dark:shadow-white/10 hover:-translate-y-0.5 inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed disabled:translate-y-0"
                                >
                                    Continue <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        </motion.div>

                    ) : step === 'role' ? (
                        <motion.div
                            key="role"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full max-w-xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 mb-8 text-xs font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                Your profile
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-4 leading-[1.1]">
                                Hi {name}, what&apos;s your current role?
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 font-medium mb-10">
                                Share your current or most recent position — or type <span className="text-indigo-600 dark:text-indigo-400 font-semibold">&quot;student&quot;</span> if you&apos;re studying.
                            </p>

                            {/* Role input */}
                            <input
                                ref={roleRef}
                                type="text"
                                value={roleInput}
                                onChange={e => setRoleInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && isValidRole() && !isLocating && handleContinue()}
                                placeholder="e.g. Founder, Software Engineer, student..."
                                className="w-full text-lg font-medium text-slate-900 dark:text-zinc-50 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 px-5 py-4 rounded-2xl transition-all mb-4"
                            />

                            {/* Student extra fields */}
                            <AnimatePresence>
                                {isStudentContext && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                        className="overflow-hidden space-y-3 mb-4"
                                    >
                                        {/* Level dropdown */}
                                        <div className="relative">
                                            <select
                                                value={studentLevel}
                                                onChange={e => setStudentLevel(e.target.value)}
                                                className="w-full appearance-none bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 text-slate-900 dark:text-zinc-50 font-medium px-5 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 transition-all cursor-pointer"
                                            >
                                                <option value="" disabled>Select your education level...</option>
                                                {DEGREE_LEVELS.map(d => (
                                                    <option key={d} value={d}>{d}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500 pointer-events-none" />
                                        </div>

                                        {/* Subject */}
                                        <input
                                            type="text"
                                            value={subjectArea}
                                            onChange={e => setSubjectArea(e.target.value)}
                                            placeholder="What field do you study? (e.g. Computer Science)"
                                            className="w-full text-base font-medium text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 dark:placeholder:text-zinc-600 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 px-5 py-4 rounded-2xl transition-all"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setStep('name')}
                                    className="px-6 py-3 rounded-full text-slate-600 dark:text-zinc-400 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm"
                                >
                                    ← Back
                                </button>

                                <motion.div animate={{ opacity: isValidRole() ? 1 : 0.3 }}>
                                    <button
                                        onClick={handleContinue}
                                        disabled={!isValidRole() || isLocating}
                                        className="h-14 px-8 rounded-full text-base font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-zinc-100 transition-all shadow-xl shadow-slate-200/50 dark:shadow-white/10 hover:-translate-y-0.5 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                    >
                                        {isLocating ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Locating...</>
                                        ) : (
                                            <>Continue <ArrowRight className="w-5 h-5" /></>
                                        )}
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : step === 'location' ? (
                        <motion.div
                            key="location"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 30 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="w-full max-w-xl"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/10 mb-8 text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-widest shadow-sm">
                                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                                Location Check
                            </div>

                            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 mb-4 leading-[1.1]">
                                Where are you located?
                            </h1>
                            <p className="text-slate-500 dark:text-zinc-400 font-medium mb-10">
                                We couldn&apos;t fetch your location automatically. We need this to find local salaries, universities, and job trends!
                            </p>

                            <input
                                type="text"
                                value={manualLocation}
                                onChange={e => setManualLocation(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleManualLocationSubmit()}
                                placeholder="e.g. London, UK or New York"
                                autoFocus
                                className="w-full text-2xl font-medium text-slate-900 dark:text-zinc-50 placeholder:text-slate-300 dark:placeholder:text-zinc-600 bg-transparent border-b-2 border-slate-200 dark:border-white/10 focus:border-indigo-600 dark:focus:border-indigo-500 focus:outline-none py-3 transition-colors mb-3"
                            />
                            <p className="text-sm text-slate-400 dark:text-zinc-500 mb-12">Press Enter or click Finish</p>

                            <div className="flex items-center justify-between mt-8">
                                <button
                                    onClick={() => setStep('role')}
                                    className="px-6 py-3 rounded-full text-slate-600 dark:text-zinc-400 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-sm"
                                >
                                    ← Back
                                </button>

                                <motion.div animate={{ opacity: manualLocation.trim() ? 1 : 0.3 }}>
                                    <button
                                        onClick={handleManualLocationSubmit}
                                        disabled={!manualLocation.trim()}
                                        className="h-14 px-8 rounded-full text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:-translate-y-0.5 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                    >
                                        Finish <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </main>
        </div>
    );
}
