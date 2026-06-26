"use client";

import { useRef, useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Upload,
  File as FileIcon,
  X,
  Loader2,
  CheckCircle2,
  EyeOff,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopBar } from "@/components/app/top-bar";
import { Field } from "@/components/app/kit";
import { FRAUD_CATEGORIES } from "@/lib/owc-data";

export function FraudScreen() {
  const [anon, setAnon] = useState(true);
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!category) return toast.error("Please choose a report type.");
    if (!details) return toast.error("Please describe what you observed.");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setReference(`FR-2026-${Math.floor(1000 + Math.random() * 8999)}`);
      toast.success("Report submitted confidentially.");
    }, 1300);
  };

  if (reference) {
    return (
      <div className="flex h-full flex-col">
        <TopBar title="Report submitted" subtitle="Confidential" showBack={false} />
        <div className="flex flex-1 flex-col items-center overflow-y-auto no-scrollbar px-6 py-8 text-center">
          <span className="grid h-20 w-20 animate-pop-in place-items-center rounded-full bg-success text-white">
            <ShieldCheck className="h-10 w-10" />
          </span>
          <h2 className="mt-5 font-serif text-2xl font-bold text-primary">
            Thank you for speaking up
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Your report has been submitted securely to the OWC Integrity Unit.
            {anon && " No identifying information was attached."}
          </p>
          <div className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Report reference
              </div>
              <div className="font-mono text-lg font-bold text-primary">
                {reference}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(reference);
                toast.success("Reference copied");
              }}
              className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground transition active:scale-90"
              aria-label="Copy reference"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-4 text-[12px] text-muted-foreground">
            Keep this reference to follow up confidentially if you wish.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Report Fraud" subtitle="Confidential & secure" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        {/* Intro */}
        <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-app">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">
            Report suspected false claims, uninsured employers, under-declared
            wages or misconduct. Your report helps protect genuine workers and
            public funds.
          </p>
        </div>

        {/* Anonymous toggle */}
        <label className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
            <EyeOff className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-bold text-foreground">
              Report anonymously
            </span>
            <span className="block text-[11.5px] text-muted-foreground">
              No name or contact details required.
            </span>
          </span>
          <Switch checked={anon} onCheckedChange={setAnon} />
        </label>

        {/* Form */}
        <div className="mt-4 space-y-4 rounded-2xl border border-border bg-card p-4 shadow-app">
          <Field label="Type of report" required>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                {FRAUD_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="subj" label="Who or what is involved?">
            <Input
              id="subj"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Employer, claim ref, person, location"
              className="h-11"
            />
          </Field>

          <Field id="det" label="Describe what you observed" required>
            <Textarea
              id="det"
              rows={5}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Include dates, places and what happened. Avoid sharing your own identity if reporting anonymously."
            />
          </Field>

          {/* Evidence */}
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-4 py-5 text-center transition active:scale-[0.99] hover:border-gold"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                <Upload className="h-5 w-5" />
              </span>
              <span className="text-[12px] font-semibold text-foreground">
                Attach evidence (optional)
              </span>
              <span className="text-[11px] text-muted-foreground">
                Photos or documents · up to 5 files
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => {
                const list = e.target.files;
                if (!list) return;
                setFiles((p) =>
                  [...p, ...Array.from(list).map((f) => ({ name: f.name, size: f.size }))].slice(0, 5)
                );
              }}
            />
            {files.length > 0 && (
              <ul className="mt-2 space-y-2">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2"
                  >
                    <FileIcon className="h-4 w-4 shrink-0 text-gold" />
                    <span className="flex-1 truncate text-[12.5px]">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Optional contact when not anonymous */}
          {!anon && (
            <div className="animate-fade-up space-y-4 rounded-xl bg-secondary/50 p-3">
              <Field id="rn" label="Your name (optional)">
                <Input
                  id="rn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="h-11"
                />
              </Field>
              <Field id="rc" label="Contact (optional)">
                <Input
                  id="rc"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone or email for follow-up"
                  className="h-11"
                />
              </Field>
            </div>
          )}

          <Button onClick={submit} disabled={sending} className="h-12 w-full">
            {sending ? (
              <>
                <Loader2 className="animate-spin" /> Submitting securely…
              </>
            ) : (
              <>
                <ShieldCheck /> Submit confidential report
              </>
            )}
          </Button>

          <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            Reports are encrypted and handled by the OWC Integrity Unit. Making a
            knowingly false report is an offence.
          </p>
        </div>
      </div>
    </div>
  );
}
