"use client";

import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, LayoutDashboard, MessageSquare, FileSearch, Clock } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { AuthModal } from "./AuthModal";
import { useRouter } from "next/navigation";

interface UserAccountNavProps {
  /** Pass "dark" when the nav is on a dark background (e.g. landing page) */
  variant?: "light" | "dark";
}

export function UserAccountNav({ variant = "light" }: UserAccountNavProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <ThemeToggle variant={variant} />
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`px-6 py-2 h-10 rounded-full text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
            variant === "dark"
              ? "bg-white text-black hover:bg-zinc-100"
              : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-zinc-100"
          }`}
        >
          Sign In
        </button>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  const dropdownContentCls = variant === "dark"
    ? "w-60 bg-zinc-900 border border-white/10 text-zinc-100 p-2 shadow-xl rounded-2xl"
    : "w-60 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 p-2 shadow-xl rounded-2xl";

  const itemCls = variant === "dark"
    ? "focus:bg-white/5 cursor-pointer rounded-lg"
    : "focus:bg-slate-50 dark:focus:bg-zinc-800 cursor-pointer rounded-lg";

  const separatorCls = variant === "dark"
    ? "bg-white/5 my-1"
    : "bg-slate-100 dark:bg-zinc-800 my-1";

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle variant={variant} />
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          <Avatar className="w-9 h-9 border-2 border-slate-200 dark:border-zinc-700 hover:border-indigo-400 transition-all cursor-pointer shadow-sm">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
            <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
              {initials || <User className="w-4 h-4" />}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={dropdownContentCls}>
          <div className="flex items-center gap-3 p-2 mb-1">
            <Avatar className="w-10 h-10 border border-slate-200 dark:border-zinc-700">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              {session.user.name && (
                <p className="text-sm font-semibold leading-none truncate">{session.user.name}</p>
              )}
              {session.user.email && (
                <p className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-1">
                  {session.user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator className={separatorCls} />
          <DropdownMenuItem asChild className={itemCls}>
            <Link href="/dashboard" className="flex items-center gap-2.5 px-2 py-1.5">
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemCls}>
            <Link href="/chat" className="flex items-center gap-2.5 px-2 py-1.5">
              <MessageSquare className="w-4 h-4 text-violet-500" />
              <span className="font-medium">AI Career Chat</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemCls}>
            <Link href="/resume-scan" className="flex items-center gap-2.5 px-2 py-1.5">
              <FileSearch className="w-4 h-4 text-emerald-500" />
              <span className="font-medium">Resume Scanner</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemCls}>
            <Link href="/history" className="flex items-center gap-2.5 px-2 py-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-medium">Report History</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={itemCls}>
            <Link href="/settings/profile" className="flex items-center gap-2.5 px-2 py-1.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="font-medium">Account Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className={separatorCls} />
          <DropdownMenuItem
            className="text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer flex items-center gap-2.5 px-2 py-1.5 rounded-lg"
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
              router.refresh();
            }}
          >
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
