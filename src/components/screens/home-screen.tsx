"use client";

import { useEffect, useState } from "react";
import { Bell, ArrowRight, ShieldCheck, ChevronRight, TrendingUp } from "lucide-react";
import { useNav } from "@/lib/nav";
import { Icon } from "@/components/app/icon";
import { InstallBanner } from "@/components/app/install-banner";
import { NationalEmblem } from "@/components/brand/emblem";
import {
  QUICK_ACTIONS,
  STAT_HIGHLIGHTS,
  TICKER,
  NEWS,
  PROFILE,
  ORG,
} from "@/lib/owc-data";
import { cn } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HomeScreen() {
  const { navigate, unreadCount } = useNav();
  const featured = NEWS.find((n) => n.featured) ?? NEWS[0];

  // Compute time-based greeting on the client only to avoid hydration mismatch.
  const [greet, setGreet] = useState("Welcome");
  useEffect(() => setGreet(greeting()), []);

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar bg-background">
      {/* Header */}
      <header className="relative shrink-0 overflow-hidden bg-navy-grad px-5 pb-6 pt-4 text-white">
        <div className="absolute inset-0 bg-grid-faint opacity-50" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <NationalEmblem className="h-11 w-11" />
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-white/60">{greet},</p>
              <p className="font-serif text-[17px] font-bold">
                {PROFILE.name.split(" ")[0]}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("notifications")}
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition active:scale-90"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy ring-2 ring-[hsl(var(--navy-deep))]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        <p className="relative mt-3 max-w-[16rem] text-[12px] leading-relaxed text-white/70">
          Fair, timely &amp; transparent workers compensation under the{" "}
          <span className="font-semibold text-gold">{ORG.act}</span>.
        </p>

        {/* Featured lodge hero card */}
        <button
          type="button"
          onClick={() => navigate("lodge")}
          className="group relative mt-4 flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-app transition active:scale-[0.99]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold-grad text-navy">
            <Icon name="FilePlus2" className="h-6 w-6" strokeWidth={2.4} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-[16px] font-bold text-primary">
              Injured at work?
            </span>
            <span className="block text-[12px] text-muted-foreground">
              Lodge your compensation claim in minutes — it&apos;s free.
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-gold transition group-active:translate-x-0.5" />
        </button>
      </header>

      {/* Ticker */}
      <div className="overflow-hidden border-b border-border bg-secondary/60 py-2">
        <div className="flex w-max animate-ticker gap-8 whitespace-nowrap pl-4">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Install app banner (Android prompt / iOS instructions) */}
      <InstallBanner />

      {/* Quick actions */}
      <section className="px-4 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-[17px] font-bold text-primary">Services</h2>
          <span className="rule-gold" />
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {QUICK_ACTIONS.map((a, i) => (
            <button
              key={a.key}
              type="button"
              onClick={() => navigate(a.screen as never)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="animate-fade-up flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card p-2.5 text-center transition active:scale-95"
            >
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-xl",
                  a.tone === "gold"
                    ? "bg-gold/15 text-gold-foreground"
                    : a.tone === "navy"
                      ? "bg-primary text-white"
                      : "bg-secondary text-primary"
                )}
              >
                <Icon name={a.icon} className="h-5 w-5" strokeWidth={2.1} />
              </span>
              <span className="text-[10.5px] font-semibold leading-tight text-foreground">
                {a.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pt-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-app">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold" />
            <h3 className="text-[13px] font-bold text-primary">
              National snapshot · 2025
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {STAT_HIGHLIGHTS.map((s) => (
              <div key={s.label} className="rounded-xl bg-secondary/60 p-3">
                <div className="font-serif text-xl font-bold text-primary">
                  {s.value}
                </div>
                <div className="mt-0.5 text-[10.5px] leading-tight text-muted-foreground">
                  {s.label}
                </div>
                <div className="mt-1 text-[10px] font-semibold text-success">
                  {s.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest news */}
      <section className="px-4 pt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-[17px] font-bold text-primary">
            Latest news
          </h2>
          <button
            type="button"
            onClick={() => navigate("news")}
            className="inline-flex items-center gap-0.5 text-[12px] font-semibold text-primary"
          >
            See all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => navigate("news-detail", { slug: featured.slug })}
          className="block w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-app transition active:scale-[0.99]"
        >
          <div className="relative h-36 w-full">
            <img
              src={featured.image}
              alt=""
              className="h-full w-full object-cover"
            />
            <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
              {featured.category}
            </span>
          </div>
          <div className="p-3.5">
            <h3 className="font-serif text-[15px] font-bold leading-snug text-primary">
              {featured.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">
              {featured.excerpt}
            </p>
          </div>
        </button>
      </section>

      {/* Security band */}
      <section className="px-4 py-6">
        <div className="flex items-center gap-3 rounded-2xl border border-success/25 bg-success/5 p-4">
          <ShieldCheck className="h-7 w-7 shrink-0 text-success" />
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">
              Your data is protected.
            </span>{" "}
            All submissions are encrypted and handled under PNG Government data
            security standards. Lodging a claim is always free.
          </p>
        </div>
      </section>
    </div>
  );
}
