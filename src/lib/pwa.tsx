"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAContextValue {
  canInstall: boolean;
  isIOS: boolean;
  isStandalone: boolean;
  promptInstall: () => Promise<"accepted" | "dismissed" | "unavailable">;
}

const PWAContext = createContext<PWAContextValue | null>(null);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Register the service worker (enables installability + offline).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    // Detect platform / display mode.
    const ua = window.navigator.userAgent || "";
    const iOS = /iphone|ipad|ipod/i.test(ua);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari
      window.navigator.standalone === true;
    setIsIOS(iOS);
    setIsStandalone(standalone);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return "unavailable" as const;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    return choice.outcome;
  }, [deferred]);

  const value = useMemo<PWAContextValue>(
    () => ({
      canInstall: !!deferred,
      isIOS,
      isStandalone,
      promptInstall,
    }),
    [deferred, isIOS, isStandalone, promptInstall]
  );

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

export function usePWA() {
  const ctx = useContext(PWAContext);
  if (!ctx) throw new Error("usePWA must be used within PWAProvider");
  return ctx;
}
