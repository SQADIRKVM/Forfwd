"use client";

import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Monitor, Clock, Shield, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SecurityPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOutAll = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      toast.success("Signed out from all devices");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await authClient.deleteUser();
      toast.success("Account deleted. Goodbye!");
      router.push("/");
    } catch {
      toast.error("Failed to delete account. Contact support.");
      setIsDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const joinedDate = session?.user?.createdAt
    ? new Date(session.user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">Security</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage your account security and active sessions.</p>
      </div>

      <Separator className="bg-slate-100 dark:bg-white/5" />

      {/* Account Info */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-zinc-50 text-sm">Account protected</p>
          <p className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">
            Signed in as <span className="font-medium text-slate-700 dark:text-zinc-300">{session?.user?.email}</span>
            {joinedDate && <> · Member since {joinedDate}</>}
          </p>
        </div>
      </div>

      {/* Active Session Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900 dark:text-zinc-50 flex items-center gap-2">
            <Monitor className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
            Current session
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOutAll}
            disabled={isSigningOut}
            className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            {isSigningOut ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" />Signing out...</> : "Sign out everywhere"}
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-slate-400 dark:text-zinc-400" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-slate-900 dark:text-zinc-50">This browser</span>
                <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 text-[10px] h-4 px-2">
                  Active now
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-zinc-500">
                <Clock className="w-3 h-3" />
                <span>Session active · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-100 dark:bg-white/5" />

      {/* Danger Zone */}
      <div className="pt-2 p-6 rounded-3xl border border-rose-200 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5">
        <h4 className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </h4>
        <p className="text-sm text-slate-500 dark:text-zinc-500 mt-2 max-w-md">
          Permanently delete your CareerX account and all associated data including your reports, questionnaire answers, and profile. This action <strong className="text-rose-500">cannot be undone</strong>.
        </p>

        {!showDeleteConfirm ? (
          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            className="mt-4 text-rose-500 hover:text-white hover:bg-rose-500 dark:hover:bg-rose-500 transition-all px-8 rounded-full border border-rose-300 dark:border-rose-500/50 h-10 font-semibold"
          >
            Delete my account
          </Button>
        ) : (
          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={handleDeleteAccount}
              disabled={isDeletingAccount}
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 h-10 font-semibold"
            >
              {isDeletingAccount ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Deleting...</> : "Yes, delete permanently"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-full px-6 h-10 text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
