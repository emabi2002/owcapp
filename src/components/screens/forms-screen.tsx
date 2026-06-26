"use client";

import { useMemo, useState } from "react";
import { Search, Download, FileText, Check } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TopBar } from "@/components/app/top-bar";
import { FORMS, FORM_CATEGORIES } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

export function FormsScreen() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof FORM_CATEGORIES)[number]>("All");
  const [saved, setSaved] = useState<string[]>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORMS.filter((f) => {
      const matchCat = cat === "All" || f.category === cat;
      const matchQ =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat]);

  const download = (code: string, title: string) => {
    setSaved((s) => (s.includes(code) ? s : [...s, code]));
    toast.success(`${code} saved for offline viewing`, { description: title });
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Forms & Downloads" subtitle="Official OWC documents" />

      {/* Search + filters */}
      <div className="space-y-3 border-b border-border bg-card px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms by name or code…"
            className="h-11 pl-9"
          />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto no-scrollbar px-1">
          {FORM_CATEGORIES.map((c) => (
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

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <p className="mb-3 text-[12px] text-muted-foreground">
          {results.length} document{results.length !== 1 && "s"}
        </p>
        <div className="space-y-2.5">
          {results.map((f) => {
            const isSaved = saved.includes(f.code);
            return (
              <div
                key={f.code}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-app"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                      {f.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {f.format} · {f.size}
                    </span>
                  </div>
                  <h3 className="mt-0.5 truncate text-[13.5px] font-semibold text-foreground">
                    {f.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => download(f.code, f.title)}
                  aria-label={`Download ${f.code}`}
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition active:scale-90",
                    isSaved
                      ? "bg-success/12 text-success"
                      : "bg-primary text-white"
                  )}
                >
                  {isSaved ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
              </div>
            );
          })}

          {results.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
              <FileText className="mx-auto h-8 w-8 text-muted-foreground/60" />
              <p className="mt-2 text-[13px] font-medium text-foreground">
                No matching forms
              </p>
              <p className="text-[12px] text-muted-foreground">
                Try a different search or category.
              </p>
            </div>
          )}
        </div>

        {saved.length > 0 && (
          <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-center text-[11px] text-muted-foreground">
            {saved.length} document{saved.length !== 1 && "s"} available offline in
            My Account.
          </p>
        )}
      </div>
    </div>
  );
}
