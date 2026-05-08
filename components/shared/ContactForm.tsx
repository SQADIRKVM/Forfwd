"use client";

import { useState } from "react";
import { saveContactMessageAction } from "@/app/actions/contact";
import { Send, User, Mail, Sparkles, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<{
    type: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ type: "error", message: "Please fill in all fields before submitting." });
      return;
    }

    setStatus({ type: "loading" });

    try {
      const res = await saveContactMessageAction(formData);
      if (res.success) {
        setStatus({ type: "success", message: "Your message was successfully sent and saved!" });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: res.error ?? "Failed to save message." });
      }
    } catch (err: any) {
      setStatus({ type: "error", message: "An unexpected error occurred. Please try again." });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 md:p-10 rounded-3xl border border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0f0f0f] shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500 to-cyan-500 opacity-[0.03] dark:opacity-[0.06] rounded-full blur-2xl pointer-events-none" />
      
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-white/5 mb-4 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Support & Security
      </div>
      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">Send us a direct message</h3>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal mb-8 leading-relaxed">
        Have questions about compliance, technical RAG criteria, or course tracking? Fill out the form below to save your inquiry directly into our secure Neon database.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Name and Email */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@forfwd.tech"
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
            />
          </div>
        </div>

        {/* Row 2: Subject */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Subject Topic
          </label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Career trajectory database limits"
            className="w-full h-12 px-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
          />
        </div>

        {/* Row 3: Message */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" /> Message Details
          </label>
          <textarea
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Describe your question or request in detail..."
            className="w-full p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-white/[0.02] text-sm text-zinc-900 dark:text-zinc-50 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium resize-none leading-relaxed"
          />
        </div>

        {/* Status Alerts */}
        {status.type === "success" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold leading-relaxed">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
            {status.message}
          </motion.div>
        )}

        {status.type === "error" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 p-4 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-800 dark:text-rose-300 text-xs font-semibold leading-relaxed">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            {status.message}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-full font-bold text-sm bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-700 hover:via-blue-700 hover:to-cyan-600 text-white shadow-[0_4px_20px_rgba(79,70,229,0.25)] dark:shadow-[0_0_40px_rgba(79,70,229,0.15)] transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status.type === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving Message...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Submit Inquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
