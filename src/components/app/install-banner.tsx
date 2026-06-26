"use client";

import { useEffect, useState } from "react";
import { Download, X, Share, SquarePlus, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { usePWA } from "@/lib/pwa";

const DISMISS_KEY = "owc-install-dismissed";

export function InstallBanner() {
  const { canInstall, isIOS, isStandalone, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (isStandalone || dismissed) return null;
  // Only show when we can actually prompt (Android) or guide (iOS).
  if (!canInstall && !isIOS) return null;

  return (
    <div className="px-4 pt-4">
      <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-navy-grad p-4 text-white shadow-app">
        <div className="absolute inset-0 bg-grid-faint opacity-40" />
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full text-white/70 transition active:scale-90 hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-grad text-navy">
            <Smartphone className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1 pr-5">
            <h3 className="font-serif text-[15px] font-bold">Install the OWC app</h3>
            {isIOS ? (
              <p className="mt-1 flex flex-wrap items-center gap-1 text-[12px] leading-relaxed text-white/75">
                Tap
                <Share className="mx-0.5 inline h-3.5 w-3.5 text-gold" />
                <span className="font-semibold text-white">Share</span>, then
                <SquarePlus className="mx-0.5 inline h-3.5 w-3.5 text-gold" />
                <span className="font-semibold text-white">Add to Home Screen</span>.
              </p>
            ) : (
              <p className="mt-1 text-[12px] leading-relaxed text-white/75">
                Add OWC PNG to your home screen for faster, offline-ready access
                to claims and services.
              </p>
            )}

            {!isIOS && (
              <button
                type="button"
                onClick={async () => {
                  const res = await promptInstall();
                  if (res === "accepted") toast.success("Installing OWC PNG…");
                  else if (res === "dismissed") toast.info("Install cancelled");
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gold-grad px-4 py-2 text-[13px] font-bold text-navy transition active:scale-95"
              >
                <Download className="h-4 w-4" /> Install app
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
