"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TopBar } from "@/components/app/top-bar";
import { getPublicForms, type PublicFormDoc } from "@/lib/api";
import { FORMS, FORM_CATEGORIES } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

export function FormsScreen() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof FORM_CATEGORIES)[number]>("All");
  const [forms, setForms] = useState<PublicFormDoc[]>(FORMS);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"owc-api" | "mock">("mock");

  useEffect(() => {
    let active = true;
    void getPublicForms()
      .then((result) => {
        if (!active) return;
        setForms(result.items);
        setSource(result.source);
      })
      .catch(() => {
        if (!active) return;
        setForms(FORMS);
        setSource("mock");
        toast.error("Live OWC forms are temporarily unavailable. Showing the local catalogue.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return forms.filter((f) => {
      const matchCat = cat === "All" || f.category === cat;
      const matchQ =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat, forms]);

  const download = (form: PublicFormDoc) => {
    if (!form.fileUrl) {
      toast.info(`${form.code} is listed, but no published download file is available yet.`);
      return;
    }
    window.open(form.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Forms & Downloads" subtitle="Official OWC documents" />

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
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[12px] text-muted-foreground">
            {results.length} document{results.length !== 1 && "s"}
          </p>
          {loading ? (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" /> Updating
            </span>
          ) : source === "mock" ? (
            <span className="text-[10px] text-muted-foreground">Local catalogue</span>
          ) : null}
        </div>

        <div className="space-y-2.5">
          {results.map((f) => (
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
                onClick={() => download(f)}
                aria-label={`Download ${f.code}`}
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition active:scale-90",
                  f.fileUrl
                    ? "bg-primary text-white"
                    : "bg-secondary text-muted-foreground",
                )}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}

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
      </div>
    </div>
  );
}
