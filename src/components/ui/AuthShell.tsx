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

      <main className="relative min-h-[100dvh] overflow-x-hidden book-surface pt-[3.25rem] sm:pt-14">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -left-24 top-20 h-40 w-40 rounded-full bg-blue-400/20 blur-3xl sm:h-48 sm:w-48 md:h-56 md:w-56" />

          <div className="absolute -right-16 bottom-10 h-44 w-44 rounded-full bg-indigo-400/15 blur-3xl sm:h-52 sm:w-52 md:h-60 md:w-60" />

          <div className="absolute left-1/2 top-1/3 h-32 w-32 -translate-x-1/2 rounded-full bg-sky-300/10 blur-2xl sm:h-40 sm:w-40" />

        </div>



        <div className="relative mx-auto flex min-h-[calc(100dvh-3.25rem)] w-full max-w-[20rem] flex-col justify-center px-3 py-5 sm:min-h-[calc(100dvh-3.5rem)] sm:max-w-[21rem] sm:px-4 sm:py-8 md:min-h-0 md:max-w-[17.5rem] md:justify-start md:py-10 lg:py-12">

          <motion.div

            initial={{ opacity: 0, y: 16 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.45, ease: "easeOut" }}

            className="w-full"

          >

            <div className="mb-4 flex flex-col items-center gap-2 text-center sm:mb-5 md:mb-3 md:gap-1.5">

              <motion.div

                initial={{ scale: 0.9, opacity: 0 }}

                animate={{ scale: 1, opacity: 1 }}

                transition={{ delay: 0.08, type: "spring", stiffness: 220 }}

                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-white/80 shadow-md backdrop-blur-sm sm:h-11 sm:w-11 md:h-9 md:w-9 md:rounded-lg"

                style={{

                  background:

                    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(239,246,255,0.9))",

                }}

              >

                <span className="font-serif text-base text-gold sm:text-lg md:text-sm">✝</span>

              </motion.div>

              <h1 className="font-serif text-xl font-bold tracking-tight text-navy sm:text-2xl md:text-lg">

                {title}

              </h1>

              {subtitle && (

                <p className="max-w-[16rem] px-1 text-xs leading-relaxed text-navy/55 sm:max-w-xs md:max-w-none md:text-[11px] md:leading-snug">

                  {subtitle}

                </p>

              )}

            </div>



            <div className="auth-panel glass-card rounded-2xl p-4 sm:p-5 md:rounded-xl md:p-4">

              {children}

            </div>

            {footer}

          </motion.div>

        </div>

      </main>

    </>

  );

}


