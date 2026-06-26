"use client";

import { useMemo, useRef, useState } from "react";
import {
  Upload,
  Camera,
  File as FileIcon,
  X,
  Lock,
  CheckCircle2,
  Loader2,
  Copy,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  User,
  Building2,
  Stethoscope,
  FileCheck2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopBar } from "@/components/app/top-bar";
import { Field, SecurityNote } from "@/components/app/kit";
import { useNav } from "@/lib/nav";
import { PROVINCES, CLAIM_TYPES } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Worker", icon: User },
  { label: "Employer", icon: Building2 },
  { label: "Injury", icon: Stethoscope },
  { label: "Documents", icon: FileCheck2 },
];

export function LodgeScreen() {
  const { navigate, switchTab, back } = useNav();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<{ name: string; size: number }[]>([]);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  // form fields
  const [form, setForm] = useState({
    name: "",
    dob: "",
    phone: "",
    email: "",
    nid: "",
    employer: "",
    occupation: "",
    province: "",
    wage: "",
    idate: "",
    itype: "",
    location: "",
    desc: "",
  });
  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  // captcha
  const [a] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [b] = useState(() => 2 + Math.floor(Math.random() * 6));
  const [captcha, setCaptcha] = useState("");
  const captchaOk = Number(captcha) === a + b;

  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).map((f) => ({ name: f.name, size: f.size }));
    setFiles((p) => [...p, ...next].slice(0, 8));
  };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const validateStep = () => {
    if (step === 0 && (!form.name || !form.phone)) {
      toast.error("Please enter the worker's name and phone.");
      return false;
    }
    if (step === 1 && !form.employer) {
      toast.error("Please enter the employer name.");
      return false;
    }
    if (step === 2 && (!form.idate || !form.desc)) {
      toast.error("Please add the injury date and description.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const submit = () => {
    if (!captchaOk) {
      toast.error("Please complete the security check.");
      return;
    }
    if (!agree) {
      toast.error("Please confirm the declaration to proceed.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const num = Math.floor(100000 + Math.random() * 899999);
      setReference(`OWC-2026-${num}`);
      setSubmitting(false);
      toast.success("Claim submitted securely.");
    }, 1400);
  };

  if (reference) {
    return (
      <div className="flex h-full flex-col">
        <TopBar title="Claim lodged" subtitle="Confirmation" showBack={false} />
        <div className="flex flex-1 flex-col items-center overflow-y-auto no-scrollbar px-6 py-8 text-center">
          <span className="grid h-20 w-20 animate-pop-in place-items-center rounded-full bg-success text-white">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h2 className="mt-5 font-serif text-2xl font-bold text-primary">
            Your claim has been lodged
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground">
            Your claim is registered with the Office of Workers Compensation. Keep
            your reference number safe to track progress.
          </p>
          <div className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Reference number
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
          <Button
            onClick={() => navigate("track", { ref: reference })}
            className="mt-6 h-12 w-full"
          >
            Track this claim <ArrowRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => switchTab("home")}
            className="mt-3 h-12 w-full"
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Lodge a Claim"
        subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step].label}`}
        showBack={false}
      />

      {/* Stepper */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const StepIcon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.label} className="flex flex-1 flex-col items-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border-2 transition",
                    done && "border-success bg-success text-white",
                    active && "border-gold bg-gold/15 text-gold-foreground",
                    !done && !active && "border-border bg-secondary text-muted-foreground"
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </span>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-semibold",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gold-grad transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        <div key={step} className="animate-screen-in space-y-4">
          {step === 0 && (
            <>
              <Field id="name" label="Full name" required>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Given and family name"
                  className="h-11"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="dob" label="Date of birth">
                  <Input
                    id="dob"
                    type="date"
                    value={form.dob}
                    onChange={(e) => set("dob", e.target.value)}
                    className="h-11"
                  />
                </Field>
                <Field id="nid" label="National ID">
                  <Input
                    id="nid"
                    value={form.nid}
                    onChange={(e) => set("nid", e.target.value)}
                    placeholder="ID number"
                    className="h-11"
                  />
                </Field>
              </div>
              <Field id="phone" label="Phone" required>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+675 …"
                  inputMode="tel"
                  className="h-11"
                />
              </Field>
              <Field id="email" label="Email">
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  className="h-11"
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field id="employer" label="Employer name" required>
                <Input
                  id="employer"
                  value={form.employer}
                  onChange={(e) => set("employer", e.target.value)}
                  placeholder="Company / organisation"
                  className="h-11"
                />
              </Field>
              <Field id="occupation" label="Occupation">
                <Input
                  id="occupation"
                  value={form.occupation}
                  onChange={(e) => set("occupation", e.target.value)}
                  placeholder="Your role"
                  className="h-11"
                />
              </Field>
              <Field label="Province">
                <Select value={form.province} onValueChange={(v) => set("province", v)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select province" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="wage" label="Weekly wage (Kina)" hint="Used to estimate entitlements.">
                <Input
                  id="wage"
                  value={form.wage}
                  onChange={(e) => set("wage", e.target.value)}
                  placeholder="e.g. 650"
                  inputMode="numeric"
                  className="h-11"
                />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field id="idate" label="Date of injury" required>
                  <Input
                    id="idate"
                    type="date"
                    value={form.idate}
                    onChange={(e) => set("idate", e.target.value)}
                    className="h-11"
                  />
                </Field>
                <Field label="Type of injury">
                  <Select value={form.itype} onValueChange={(v) => set("itype", v)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLAIM_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field id="location" label="Where did it happen?">
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Worksite / location"
                  className="h-11"
                />
              </Field>
              <Field id="desc" label="Describe what happened" required>
                <Textarea
                  id="desc"
                  rows={5}
                  value={form.desc}
                  onChange={(e) => set("desc", e.target.value)}
                  placeholder="Briefly describe the accident, how it occurred and the injury sustained."
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => camRef.current?.click()}
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-3 py-5 text-center transition active:scale-95 hover:border-gold"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <Camera className="h-5 w-5" />
                  </span>
                  <span className="text-[12px] font-semibold text-foreground">
                    Take photo
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-3 py-5 text-center transition active:scale-95 hover:border-gold"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
                    <Upload className="h-5 w-5" />
                  </span>
                  <span className="text-[12px] font-semibold text-foreground">
                    Upload files
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Attach a medical report (MED-1), proof of ID, payslip and injury
                photos · PDF/JPG/PNG · up to 8 files.
              </p>

              <input
                ref={camRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
                    >
                      <FileIcon className="h-4 w-4 shrink-0 text-gold" />
                      <span className="flex-1 truncate text-[13px] text-foreground">
                        {f.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {(f.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((p) => p.filter((_, idx) => idx !== i))
                        }
                        className="text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${f.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <SecurityNote>
                All uploads are encrypted in transit and at rest.
              </SecurityNote>

              {/* Captcha */}
              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-foreground">
                    Security check
                  </span>
                  <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-primary px-3 py-2 font-mono text-[15px] font-bold tracking-widest text-white">
                    {a} + {b} = ?
                  </span>
                  <Input
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value)}
                    inputMode="numeric"
                    placeholder="Answer"
                    className="h-10 flex-1"
                  />
                  {captchaOk && <CheckCircle2 className="h-5 w-5 text-success" />}
                </div>
              </div>

              {/* Declaration */}
              <label className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v) => setAgree(Boolean(v))}
                  className="mt-0.5"
                />
                <span className="text-[12px] leading-relaxed text-muted-foreground">
                  I declare that the information provided is true and correct to
                  the best of my knowledge, and I consent to OWC processing this
                  claim under the Workers Compensation Act 1978.
                </span>
              </label>
            </>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div className="shrink-0 border-t border-border bg-card p-3 pb-safe">
        <div className="flex gap-3 pb-1">
          <Button
            variant="outline"
            onClick={step === 0 ? back : () => setStep((s) => Math.max(s - 1, 0))}
            className="h-12 flex-1"
          >
            {step === 0 ? (
              "Cancel"
            ) : (
              <>
                <ArrowLeft /> Back
              </>
            )}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="h-12 flex-[2]">
              Continue <ArrowRight />
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting} className="h-12 flex-[2]">
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Lock /> Submit securely
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
