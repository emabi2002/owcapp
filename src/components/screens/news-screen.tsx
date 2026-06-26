"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Share2 } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/app/top-bar";
import { Pill } from "@/components/app/kit";
import { useNav } from "@/lib/nav";
import { NEWS } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

const CATS = ["All", "Announcement", "Public Notice", "Awareness", "Consultation", "Labour Update"];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function NewsScreen() {
  const { navigate } = useNav();
  const [cat, setCat] = useState("All");

  const items = useMemo(
    () => (cat === "All" ? NEWS : NEWS.filter((n) => n.category === cat)),
    [cat]
  );
  const featured = items.find((n) => n.featured) ?? items[0];
  const rest = items.filter((n) => n.slug !== featured?.slug);

  return (
    <div className="flex h-full flex-col">
      <TopBar title="News & Public Notices" subtitle="Official announcements" />

      <div className="border-b border-border bg-card px-4 py-3">
        <div className="-mx-1 flex gap-2 overflow-x-auto no-scrollbar px-1">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
                cat === c
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {featured && (
          <button
            type="button"
            onClick={() => navigate("news-detail", { slug: featured.slug })}
            className="mb-4 block w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-app transition active:scale-[0.99]"
          >
            <div className="relative h-44 w-full">
              <img src={featured.image} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                {featured.category}
              </span>
              <h2 className="absolute bottom-3 left-3 right-3 font-serif text-[16px] font-bold leading-snug text-white">
                {featured.title}
              </h2>
            </div>
          </button>
        )}

        <div className="space-y-2.5">
          {rest.map((n) => (
            <button
              key={n.slug}
              type="button"
              onClick={() => navigate("news-detail", { slug: n.slug })}
              className="flex w-full gap-3 rounded-2xl border border-border bg-card p-2.5 text-left shadow-app transition active:scale-[0.99]"
            >
              <img
                src={n.image}
                alt=""
                className="h-20 w-20 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1 py-0.5">
                <Pill tone="muted" className="mb-1">
                  {n.category}
                </Pill>
                <h3 className="line-clamp-2 text-[13px] font-bold leading-snug text-foreground">
                  {n.title}
                </h3>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarDays className="h-3 w-3" />
                  {fmtDate(n.date)}
                </div>
              </div>
              <ChevronRight className="mt-8 h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NewsDetailScreen() {
  const { params } = useNav();
  const item = NEWS.find((n) => n.slug === params.slug) ?? NEWS[0];

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Article"
        subtitle={item.category}
        action={
          <button
            type="button"
            onClick={() => toast.success("Share link copied")}
            aria-label="Share"
            className="grid h-9 w-9 place-items-center rounded-full text-white/90 transition active:scale-90 hover:bg-white/10"
          >
            <Share2 className="h-5 w-5" />
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="relative h-52 w-full">
          <img src={item.image} alt="" className="h-full w-full object-cover" />
          <span className="absolute left-4 top-4 rounded-full bg-gold px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
            {item.category}
          </span>
        </div>
        <article className="px-5 py-5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {fmtDate(item.date)}
          </div>
          <h1 className="mt-2 font-serif text-[22px] font-bold leading-tight text-primary">
            {item.title}
          </h1>
          <div className="mt-3 h-[3px] w-12 rounded-full bg-gold" />
          <p className="mt-4 text-[14px] font-semibold leading-relaxed text-foreground">
            {item.excerpt}
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            {item.body}
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4 text-[12px] text-muted-foreground">
            Issued by the Office of Workers Compensation, Ministry of Labour &
            Employment, Independent State of Papua New Guinea.
          </div>
        </article>
      </div>
    </div>
  );
}
