'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-transparent flex flex-col items-center justify-center text-center px-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center mx-auto mb-8 shadow-sm">
          <Search className="w-10 h-10 text-indigo-500" />
        </div>

        {/* 404 */}
        <div className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-violet-500 mb-4 leading-none">
          404
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-lg leading-relaxed mb-10">
          Looks like this page took a wrong turn. Let&apos;s get you back on your career path.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-lg shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:-translate-y-0.5"
          >
            <Compass className="w-4 h-4" />
            Go home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
