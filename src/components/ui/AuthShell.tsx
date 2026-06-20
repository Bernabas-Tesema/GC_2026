"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden book-surface pt-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-300/10 blur-2xl" />
      </div>

      <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 flex flex-col items-center gap-3 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-white/80 shadow-lg backdrop-blur-sm"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,246,255,0.9))",
              }}
            >
              <span className="font-serif text-2xl text-gold">✝</span>
            </motion.div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-navy sm:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="max-w-xs text-sm leading-relaxed text-navy/55">{subtitle}</p>
            )}
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8">{children}</div>
          {footer}
        </motion.div>
      </div>
    </main>
  );
}
