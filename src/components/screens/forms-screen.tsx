"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Download, FileText, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { TopBar } from "@/components/app/top-bar";
import { FORMS, FORM_CATEGORIES } from "@/lib/owc-data";
import type { FormItem } from "@/lib/api/contracts";
import { cn } from "@/lib/utils";

const fallbackEnabled = process.env.NEXT_PUBLIC_OWC_PUBLIC_CONTENT_FALLBACK === "true";

function localForms(): FormItem[] {
  return FORMS.map((item) => ({
    id: item.code,
    code: item.code,
    title: item.title,
    category: item.category,
    format: item.format,
    size: item.size,
    updated: item.updated,
  }));
}

export function FormsScreen() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<(typeof FORM_CATEGORIES)[number]>("All");
  const [saved, setSaved] = useState<string[]>([]);
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetch("/api/owc/content/forms", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Forms service unavailable");
        const payload = (await response.json()) as { items?: FormItem[] };
        setForms(Array.isArray(payload.items) ? payload.items : []);
      })
      .catch(() => {
        if (fallbackEnabled) setForms(localForms());
        else toast.error("Official forms are temporarily unavailable.");
      })
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return forms.filter((form) => {
      const matchCat = cat === "All" || form.category === cat;
      const matchQ = !q || form.title.toLowerCase().includes(q) || form.code.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, cat, forms]);

  const download = (form: FormItem) => {
    setSaved((current) => (current.includes(form.code) ? current : [...current, form.code]));
    if (form.fileUrl) {
      window.open(form.fileUrl, "_blank", "noopener,noreferrer");
      toast.success(`${form.code} opened`, { description: form.title });
      return;
    }
    toast.success(`${form.code} saved for offline viewing`, { description: form.title });
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Forms & Downloads" subtitle="Official OWC documents" />
      <div className="space-y-3 border-b border-border bg-card px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search forms by name or code…" className="h-11 pl-9" />
        </div>
        <div className="-mx-1 flex gap-2 overflow-x-auto no-scrollbar px-1">
          {FORM_CATEGORIES.map((category) => (
            <button key={category} type="button" onClick={() => setCat(category)} className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition", cat === category ? "border-primary bg-primary text-white" : "border-border bg-card text-muted-foreground")}>{category}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {loading ? (
          <div className="grid h-40 place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : (
          <>
            <p className="mb-3 text-[12px] text-muted-foreground">{results.length} document{results.length !== 1 && "s"}</p>
            <div className="space-y-2.5">
              {results.map((form) => {
                const isSaved = saved.includes(form.code);
                return (
                  <div key={form.id || form.code} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-app">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><FileText className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{form.code}</span>
                        <span className="text-[10px] text-muted-foreground">{form.format} · {form.size}</span>
                      </div>
                      <h3 className="mt-0.5 truncate text-[13.5px] font-semibold text-foreground">{form.title}</h3>
                    </div>
                    <button type="button" onClick={() => download(form)} aria-label={`Download ${form.code}`} className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl transition active:scale-90", isSaved ? "bg-success/12 text-success" : "bg-primary text-white")}>
                      {isSaved ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                    </button>
                  </div>
                );
              })}

              {results.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground/60" />
                  <p className="mt-2 text-[13px] font-medium text-foreground">No matching forms</p>
                  <p className="text-[12px] text-muted-foreground">Try a different search or category.</p>
                </div>
              )}
            </div>

            {saved.length > 0 && <p className="mt-4 rounded-xl bg-secondary/60 p-3 text-center text-[11px] text-muted-foreground">{saved.length} document{saved.length !== 1 && "s"} available offline in My Account.</p>}
          </>
        )}
      </div>
    </div>
  );
}
