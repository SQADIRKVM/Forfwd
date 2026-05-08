"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Compass, Loader2, X } from "lucide-react";
import { authClient } from "@/lib/auth/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultView?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultView = "signin" }: AuthModalProps) {
  const [view, setView] = useState<"signin" | "signup">(defaultView);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    if (view === "signup") {
      const name = formData.get("name") as string;
      const { error: signUpError } = await authClient.signUp.email({ email, password, name });
      if (signUpError) {
        setError(signUpError.message || "Failed to create account");
        setIsPending(false);
        return;
      }
    }

    // Sign in (called for both sign in and after sign up)
    const { error: signInError } = await authClient.signIn.email({ email, password });
    if (signInError) {
      setError(signInError.message || "Failed to sign in. Try again.");
      setIsPending(false);
      return;
    }

    setIsPending(false);
    onClose();
    // Force a hard reload to refresh the session state across the app
    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden border border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl">
        <DialogTitle className="sr-only">{view === "signin" ? "Sign In" : "Sign Up"}</DialogTitle>
        
        {/* Stunning functional close button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-all duration-200 z-50 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Background decorations inside modal */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-[80px] opacity-70 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 dark:bg-violet-500/20 rounded-full blur-[60px] opacity-70 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="p-8 md:p-10 relative z-10">
          <div className="flex justify-center mb-6">
            <img src="/banner.png" alt="Forfwd" className="h-15 w-auto object-contain block dark:hidden" />
            <img src="/banner-dark.png" alt="Forfwd" className="h-15 w-auto object-contain hidden dark:block" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1.5 tracking-tight">
              {view === "signin" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
              {view === "signin" ? "Sign in to your account to continue" : "Enter your details to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {view === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Full Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  className="h-12 px-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Email address</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="name@example.com"
                className="h-12 px-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider ml-1">Password</Label>
                {view === "signin" && (
                  <button type="button" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-semibold hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                placeholder="••••••••"
                className="h-12 px-4 rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm font-bold rounded-2xl border border-rose-100 dark:border-rose-500/20">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isPending} 
              className="w-full h-12 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:text-black dark:hover:bg-zinc-100 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (view === "signin" ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
            <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Or continue with</span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />
          </div>

          <div className="mt-6">
            <Button 
              type="button"
              variant="outline"
              className="w-full h-12 rounded-2xl font-bold border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/20 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5"
              onClick={() => authClient.signIn.social({ provider: 'google' })}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                <path d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z" fill="#EA4335"></path>
                <path d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z" fill="#4285F4"></path>
                <path d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z" fill="#FBBC05"></path>
                <path d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z" fill="#34A853"></path>
              </svg>
              Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {view === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => setView(view === "signin" ? "signup" : "signin")}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-bold hover:underline"
            >
              {view === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
