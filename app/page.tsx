"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export default function Home() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-anim=hero-title]", { y: 20, autoAlpha: 0, duration: 0.6, ease: "power2.out" });
      gsap.from("[data-anim=hero-sub]", { y: 16, autoAlpha: 0, duration: 0.6, ease: "power2.out", delay: 0.1 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen bg-white text-black dark:bg-black dark:text-zinc-50">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-sm font-medium">Litorja</div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-6 py-10 sm:grid-cols-2 sm:gap-10 sm:py-16">
          <div className="flex flex-col justify-center">
            <h1 data-anim="hero-title" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Dustin Litorja
            </h1>
            <p data-anim="hero-sub" className="mt-3 max-w-prose text-zinc-600 dark:text-zinc-400">
              Developer portfolio exploring interactive 3D and motion.
            </p>
          </div>
          <div>
            <Scene />
          </div>
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-sm text-zinc-500"> {new Date().getFullYear()} Litorja</footer>
    </div>
  );
}
