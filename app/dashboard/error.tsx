'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Dashboard Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center max-w-md w-full shadow-lg">
                <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-3">Something went wrong</h1>
                <p className="text-slate-500 text-sm mb-10 font-medium leading-relaxed">
                    We encountered an unexpected error while rendering your dashboard. The AI might have returned malformed data.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => reset()} variant="outline" className="flex-1 py-6 rounded-2xl border-slate-200">
                        <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                    </Button>
                    <Link href="/onboarding" className="flex-1">
                        <Button className="w-full h-full bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg">
                            Restart
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
