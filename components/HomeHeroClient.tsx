"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export function HomeHeroClient({ title, blurb }: { title: string; blurb: string }) {
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
    <div ref={rootRef} className="grid gap-6 py-10 sm:grid-cols-2 sm:gap-10 sm:py-16">
      <div className="flex flex-col justify-center">
        <h1 data-anim="hero-title" className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p data-anim="hero-sub" className="mt-3 max-w-prose text-zinc-600 dark:text-zinc-400">
          {blurb}
        </p>
      </div>
      <div>
        <Scene />
      </div>
    </div>
  );
}
