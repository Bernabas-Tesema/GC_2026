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
      <main className="relative flex min-h-[100dvh] flex-col overflow-x-hidden book-surface pt-[calc(3.5rem+env(safe-area-inset-top,0px))] sm:pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl sm:h-48 sm:w-48" />
          <div className="absolute -right-16 bottom-10 h-44 w-44 rounded-full bg-indigo-400/15 blur-3xl sm:h-52 sm:w-52" />
        </div>

        <div className="relative mx-auto flex w-full flex-1 items-center justify-center px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="auth-panel glass-card w-full max-w-sm rounded-2xl p-4 sm:max-w-[297px] sm:p-[13px]"
          >
            <div className="mb-4 flex flex-col items-center gap-2 text-center sm:mb-[9px] sm:gap-[7px]">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/30 bg-white/80 shadow-md backdrop-blur-sm sm:h-8 sm:w-8"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,246,255,0.9))",
                }}
              >
                <span className="font-serif text-base text-gold sm:text-sm">✝</span>
              </div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-navy sm:text-lg">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs leading-snug text-navy/55 sm:text-[11px]">
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
