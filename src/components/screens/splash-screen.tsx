"use client";

import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { BirdOfParadise, NationalEmblem } from "@/components/brand/emblem";
import { ORG } from "@/lib/owc-data";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <button
      type="button"
      onClick={onDone}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-navy-grad text-white"
    >
      <div className="absolute inset-0 bg-grid-faint opacity-60" />
      <div
        className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center px-8 text-center">
        <div className="relative grid place-items-center">
          <span className="absolute h-32 w-32 rounded-full border border-gold/40 animate-ring-pulse" />
          <span className="absolute h-32 w-32 rounded-full border border-gold/30 animate-ring-pulse [animation-delay:0.7s]" />
          <div className="animate-pop-in grid h-28 w-28 place-items-center rounded-3xl bg-white/5 ring-1 ring-white/15 backdrop-blur">
            <NationalEmblem framed={false} className="h-20 w-20 drop-shadow" />
          </div>
        </div>

        <BirdOfParadise className="mt-6 h-10 w-10 animate-fade-up [animation-delay:0.2s]" />

        <h1 className="mt-4 animate-fade-up font-serif text-[26px] font-bold leading-tight [animation-delay:0.3s]">
          Office of Workers
          <br />
          Compensation
        </h1>
        <p className="mt-2 animate-fade-up text-[12px] font-medium uppercase tracking-[0.2em] text-gold [animation-delay:0.4s]">
          {ORG.ministry}
        </p>
        <p className="mt-1 animate-fade-up text-[12px] text-white/55 [animation-delay:0.45s]">
          {ORG.country}
        </p>
      </div>

      <div className="absolute bottom-9 flex animate-fade-up flex-col items-center gap-2 [animation-delay:0.6s]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80">
          <ShieldCheck className="h-3.5 w-3.5 text-gold" />
          Secure Government Service
        </span>
        <span className="text-[11px] text-white/40">Tap to continue</span>
      </div>
    </button>
  );
}
