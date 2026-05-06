'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Send, Bot, User, ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { UserAccountNav } from '@/components/shared/UserAccountNav';
import { useOnboardingStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

const SUGGESTED_QUESTIONS = [
  "What's the best career path for me given my profile?",
  "Which universities should I target and why?",
  "What skills should I learn first to get a job faster?",
  "What salary can I expect in my field?",
  "How do I build a strong portfolio for my career?",
];

const getMessageText = (m: any): string => {
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.parts)) {
    return m.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  }
  return '';
};

export default function ChatPage() {
  const { userName, studentType, location } = useOnboardingStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hasSent, setHasSent] = useState(false);

  const context = {
    userName,
    studentType,
    location,
  };

  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    id: 'careerx-chat',
    transport: new DefaultChatTransport({
      api: '/api/chat',
      body: { context },
    }) as any,
    onFinish: () => {
      setHasSent(true);
    },
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput('');
    await sendMessage({ text });
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuggestedQuestion = (q: string) => {
    setInput(q);
  };

  return (
    <div className="relative z-10 min-h-screen bg-slate-50 dark:bg-transparent text-slate-900 dark:text-zinc-50 flex flex-col font-sans">

      {/* Nav */}
      <header className="w-full bg-white/80 dark:bg-black/40 backdrop-blur-md border-b border-slate-200 dark:border-white/5 sticky top-0 z-50">
        <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight hidden sm:block">CareerX</span>
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
            <Link href="/dashboard" className="text-sm font-semibold text-slate-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">AI Career Advisor</span>
            </div>
            <UserAccountNav />
          </div>
        </nav>
      </header>

      {/* Chat area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-4">

        {/* Welcome state */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-16"
          >
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center mb-6 shadow-sm">
              <Bot className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-zinc-50 mb-3">
              Hi{userName ? ` ${userName}` : ''}! I&apos;m your CareerX AI
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 max-w-md text-lg mb-10 leading-relaxed">
              Ask me anything about your career path, universities, skills, salaries, or how to land your dream job.
            </p>

            {/* Suggested questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-left p-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/5 transition-all text-sm text-slate-700 dark:text-zinc-300 font-medium shadow-sm"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300'
              }`}>
                {m.role === 'user'
                  ? <User className="w-4 h-4" />
                  : <Bot className="w-4 h-4" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] px-5 py-4 rounded-3xl shadow-sm ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-lg'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-zinc-50 rounded-tl-lg'
              }`}>
                {m.role === 'user' ? (
                  <p className="text-sm leading-relaxed">{getMessageText(m)}</p>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-0.5 prose-headings:my-2">
                    <ReactMarkdown>{getMessageText(m)}</ReactMarkdown>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
            </div>
            <div className="px-5 py-4 rounded-3xl rounded-tl-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Input area */}
      <div className="sticky bottom-0 bg-slate-50/90 dark:bg-black/60 backdrop-blur-xl border-t border-slate-200 dark:border-white/5 py-4 px-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-end gap-3"
        >
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
              placeholder="Ask anything about your career path..."
              rows={1}
              className="w-full resize-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 pr-14 text-sm text-slate-900 dark:text-zinc-50 placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 transition-all shadow-sm leading-relaxed"
              style={{ maxHeight: '120px' }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-600 text-white flex items-center justify-center transition-all shadow-sm shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 dark:text-zinc-600 mt-2">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
