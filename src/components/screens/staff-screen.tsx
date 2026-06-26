"use client";

import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Monitor,
  Radar,
  ShieldAlert,
  Headset,
  MessageSquareText,
  Clock,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/app/top-bar";
import { Pill } from "@/components/app/kit";
import { useNav } from "@/lib/nav";
import { STAFF_QUEUE, STAFF_STATS, type StaffItem } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

const KIND_META: Record<StaffItem["kind"], { icon: typeof Radar; tone: string }> = {
  Claim: { icon: Radar, tone: "bg-primary/10 text-primary" },
  Fraud: { icon: ShieldAlert, tone: "bg-destructive/10 text-destructive" },
  Enquiry: { icon: Headset, tone: "bg-gold/15 text-gold-foreground" },
  Message: { icon: MessageSquareText, tone: "bg-secondary text-muted-foreground" },
};

const priorityTone: Record<StaffItem["priority"], "muted" | "navy" | "warning" | "destructive"> = {
  Low: "muted",
  Normal: "navy",
  High: "warning",
  Urgent: "destructive",
};

const FILTERS = ["All", "Claim", "Fraud", "Enquiry", "Message"] as const;

export function StaffScreen() {
  const { signOut } = useNav();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [items, setItems] = useState<StaffItem[]>(STAFF_QUEUE);

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.kind === filter)),
    [items, filter]
  );

  const advance = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const nextStatus =
          i.status === "New" ? "In Review" : i.status === "In Review" ? "Actioned" : "Actioned";
        toast.success(`${i.ref} → ${nextStatus}`);
        return { ...i, status: nextStatus as StaffItem["status"] };
      })
    );
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Staff Quick Review"
        subtitle="Authorised officers"
        showBack={false}
        action={
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="grid h-9 w-9 place-items-center rounded-full text-white/90 transition active:scale-90 hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {/* Notice */}
        <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2.5">
          <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-[11.5px] text-muted-foreground">
            Triage only. Full case management is on the{" "}
            <span className="inline-flex items-center gap-0.5 font-semibold text-primary">
              web admin portal <Monitor className="h-3 w-3" />
            </span>
            .
          </p>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {STAFF_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-2.5 text-center shadow-app"
            >
              <div className="font-serif text-lg font-bold text-primary">{s.value}</div>
              <div className="text-[9.5px] leading-tight text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto no-scrollbar px-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition",
                filter === f
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-card text-muted-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Queue */}
        <div className="mt-4 space-y-2.5">
          {visible.map((i) => {
            const meta = KIND_META[i.kind];
            const M = meta.icon;
            return (
              <div
                key={i.id}
                className="rounded-2xl border border-border bg-card p-3.5 shadow-app"
              >
                <div className="flex items-start gap-3">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", meta.tone)}>
                    <M className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-primary">
                        {i.ref}
                      </span>
                      <Pill tone={priorityTone[i.priority]}>{i.priority}</Pill>
                    </div>
                    <h3 className="mt-0.5 text-[13.5px] font-semibold leading-snug text-foreground">
                      {i.subject}
                    </h3>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span>From {i.from}</span>
                      <span className="inline-flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {i.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Pill
                    tone={
                      i.status === "Actioned"
                        ? "success"
                        : i.status === "In Review"
                          ? "gold"
                          : "muted"
                    }
                  >
                    {i.status}
                  </Pill>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toast.info(`Opening ${i.ref} on web portal…`)}
                      className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-[11.5px] font-semibold text-muted-foreground transition active:scale-95"
                    >
                      Open <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    {i.status !== "Actioned" && (
                      <button
                        type="button"
                        onClick={() => advance(i.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11.5px] font-semibold text-white transition active:scale-95"
                      >
                        <Check className="h-3.5 w-3.5" />
                        {i.status === "New" ? "Review" : "Action"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
