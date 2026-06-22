"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import AuthHeader from "@/components/AuthHeader";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <>
      <AuthHeader />
      <main className="relative flex min-h-[100dvh] flex-col overflow-x-hidden book-surface pt-14 sm:pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl sm:h-48 sm:w-48" />
          <div className="absolute -right-16 bottom-10 h-44 w-44 rounded-full bg-indigo-400/15 blur-3xl sm:h-52 sm:w-52" />
        </div>

        <div className="relative mx-auto flex w-full flex-1 items-center justify-center px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="auth-panel glass-card w-full max-w-[281px] rounded-2xl p-[9px] sm:max-w-[297px] sm:p-[13px]"
          >
            <div className="mb-[9px] flex flex-col items-center gap-[7px] text-center">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/30 bg-white/80 shadow-md backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,246,255,0.9))",
                }}
              >
                <span className="font-serif text-sm text-gold">✝</span>
              </div>
              <h1 className="font-serif text-base font-bold tracking-tight text-navy sm:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] leading-snug text-navy/55 sm:text-xs">
                  {subtitle}
                </p>
              )}
            </div>

            {children}
            {footer}
          </motion.div>
        </div>
      </main>
    </>
  );
}
