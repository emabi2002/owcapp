"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  FileWarning,
  CircleDot,
  Building2,
  CalendarDays,
  Stethoscope,
  Bell,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TopBar } from "@/components/app/top-bar";
import { useNav } from "@/lib/nav";
import { SAMPLE_CLAIMS, type ClaimRecord } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

const statusDot: Record<ClaimRecord["status"], string> = {
  Received: "bg-white",
  "Under Assessment": "bg-gold",
  "Awaiting Documents": "bg-[hsl(var(--warning))]",
  Approved: "bg-success",
  Paid: "bg-success",
  Declined: "bg-destructive",
};

export function TrackScreen() {
  const { params } = useNav();
  const initialRef = (params.ref as string) || "";
  const [ref, setRef] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [claim, setClaim] = useState<ClaimRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  const lookup = (value: string) => {
    if (!value.trim()) {
      toast.error("Enter a claim reference number.");
      return;
    }
    setLoading(true);
    setNotFound(false);
    setTimeout(() => {
      const found =
        SAMPLE_CLAIMS.find(
          (c) => c.reference.toLowerCase() === value.trim().toLowerCase()
        ) ??
        // Any newly lodged OWC-2026 reference resolves to a freshly received claim
        (value.toUpperCase().startsWith("OWC-")
          ? {
              ...SAMPLE_CLAIMS[0],
              reference: value.toUpperCase(),
              status: "Received" as const,
              steps: [
                { label: "Claim received", done: true, date: "Today" },
                { label: "Documents verified", done: false },
                { label: "Medical assessment", done: false },
                { label: "Determination", done: false },
                { label: "Compensation payment", done: false },
              ],
              pending: ["Medical Practitioner's First Report (MED-1)"],
              updates: [
                { date: "Today", text: "Claim received and queued for verification." },
              ],
            }
          : null);
      setClaim(found);
      setNotFound(!found);
      setLoading(false);
    }, 900);
  };

  useEffect(() => {
    if (initialRef) lookup(initialRef);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Track a Claim" subtitle="Check your claim status" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        {/* Lookup */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-app">
          <label className="text-[13px] font-semibold text-foreground">
            Claim reference number
          </label>
          <div className="mt-2 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup(ref)}
                placeholder="OWC-2026-XXXXXX"
                className="h-11 pl-9 font-mono"
              />
            </div>
            <Button onClick={() => lookup(ref)} disabled={loading} className="h-11 px-4">
              {loading ? <Loader2 className="animate-spin" /> : "Track"}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Try{" "}
            <button
              className="font-mono font-semibold text-primary"
              onClick={() => {
                setRef("OWC-2026-004821");
                lookup("OWC-2026-004821");
              }}
            >
              OWC-2026-004821
            </button>{" "}
            for a demo.
          </p>
        </div>

        {notFound && (
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 p-4">
            <FileWarning className="h-6 w-6 shrink-0 text-[hsl(var(--warning))]" />
            <p className="text-[12px] text-muted-foreground">
              No claim found for that reference. Check the number and try again,
              or contact OWC for assistance.
            </p>
          </div>
        )}

        {claim && (
          <div className="mt-5 animate-fade-up space-y-4">
            {/* Summary */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-app">
              <div className="bg-navy-grad p-4 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[15px] font-bold">
                    {claim.reference}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/12 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-white/20">
                    <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[claim.status])} />
                    {claim.status}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-white/70">{claim.type}</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                <SummaryCell icon={<Building2 className="h-4 w-4" />} label="Employer" value={claim.employer} />
                <SummaryCell icon={<CalendarDays className="h-4 w-4" />} label="Lodged" value={claim.lodged} />
                <SummaryCell icon={<Stethoscope className="h-4 w-4" />} label="Injury date" value={claim.injuryDate} />
                <SummaryCell icon={<CircleDot className="h-4 w-4" />} label="Worker" value={claim.worker} />
              </div>
            </div>

            {/* Pending documents */}
            {claim.pending && claim.pending.length > 0 && (
              <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
                <div className="flex items-center gap-2">
                  <FileWarning className="h-4 w-4 text-[hsl(var(--warning))]" />
                  <h3 className="text-[13px] font-bold text-foreground">
                    Action required
                  </h3>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {claim.pending.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-[12px] text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--warning))]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-2xl border border-border bg-card p-4 shadow-app">
              <h3 className="mb-3 text-[13px] font-bold text-primary">
                Claim progress
              </h3>
              <ol className="relative ml-1">
                {claim.steps.map((s, i) => {
                  const last = i === claim.steps.length - 1;
                  const current = !s.done && (i === 0 || claim.steps[i - 1].done);
                  return (
                    <li key={s.label} className="relative flex gap-3 pb-5 last:pb-0">
                      {!last && (
                        <span
                          className={cn(
                            "absolute left-[11px] top-6 h-full w-0.5",
                            s.done ? "bg-success" : "bg-border"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full",
                          s.done
                            ? "bg-success text-white"
                            : current
                              ? "bg-gold text-navy"
                              : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {s.done ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : current ? (
                          <Clock className="h-3.5 w-3.5" />
                        ) : (
                          <CircleDot className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <div className="-mt-0.5">
                        <div
                          className={cn(
                            "text-[13px] font-semibold",
                            s.done || current ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {s.label}
                        </div>
                        {s.date && (
                          <div className="text-[11px] text-muted-foreground">
                            {s.date}
                          </div>
                        )}
                        {current && !s.date && (
                          <div className="text-[11px] font-medium text-gold-foreground">
                            In progress
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Updates */}
            {claim.updates && claim.updates.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-4 shadow-app">
                <h3 className="mb-3 text-[13px] font-bold text-primary">
                  OWC updates
                </h3>
                <div className="space-y-3">
                  {claim.updates.map((u, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                        <Bell className="h-3.5 w-3.5" />
                      </span>
                      <div>
                        <div className="text-[12px] text-foreground">{u.text}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {u.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button variant="outline" className="h-12 w-full">
              Upload requested document <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCell({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-card p-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="truncate text-[12.5px] font-semibold text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}
