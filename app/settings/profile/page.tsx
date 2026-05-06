"use client";

import { authClient } from "@/lib/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: session, refetch } = authClient.useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(session?.user?.name || "");

  if (!session?.user) return null;

  const initials = session.user.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsSaving(true);
    try {
      await authClient.updateUser({ name: displayName.trim() });
      await refetch();
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-50">Profile details</h3>
        <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1">Manage your public profile information.</p>
      </div>

      <Separator className="bg-slate-100 dark:bg-white/5" />

      {/* Avatar Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-2 border-slate-200 dark:border-white/10">
            <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
            <AvatarFallback className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-2xl font-bold">
              {initials || <User className="w-8 h-8" />}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-900 dark:text-zinc-50">{session.user.name}</h4>
          <p className="text-sm text-slate-500 dark:text-zinc-500">{session.user.email}</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="grid gap-6 max-w-xl">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 dark:text-zinc-300 font-medium">Display name</Label>
          <Input
            id="name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500 text-slate-900 dark:text-zinc-50 transition-colors rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 dark:text-zinc-300 font-medium">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <Input
              id="email"
              defaultValue={session.user.email || ""}
              disabled
              className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 pl-10 text-slate-400 dark:text-zinc-500 cursor-not-allowed rounded-xl"
            />
          </div>
          <p className="text-[10px] text-slate-400 dark:text-zinc-600 uppercase font-bold tracking-widest mt-1">Primary Email · Cannot be changed here</p>
        </div>
      </div>

      <div className="pt-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || displayName.trim() === session.user.name}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full h-11 font-semibold transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}
