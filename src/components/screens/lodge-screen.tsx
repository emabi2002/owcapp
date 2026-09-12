"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  CheckCircle2,
  Copy,
  File as FileIcon,
  FileCheck2,
  Loader2,
  Lock,
  RefreshCw,
  Stethoscope,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { TopBar } from "@/components/app/top-bar";
import { Field, SecurityNote } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { lodgeClaim } from "@/lib/api";
import { uploadSelectedEvidence, type EvidenceUploadSummary } from "@/lib/claim-evidence-flow";
import { buildClaimLodgementInput } from "@/lib/claim-lodgement";
import { uploadClaimEvidence } from "@/lib/evidence-api";
import { useNav } from "@/lib/nav";
import { CLAIM_TYPES, PROVINCES } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Worker", icon: User },
  { label: "Employer", icon: Building2 },
  { label: "Injury", icon: Stethoscope },
  { label: "Documents", icon: FileCheck2 },
];

const MAX_FILES = 8;

export function LodgeScreen() {
  const { navigate, switchTab, back } = useNav();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [evidenceSummary, setEvidenceSummary] = useState<EvidenceUploadSummary | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null);
  const [wasLiveSubmission, setWasLiveSubmission] = useState(false);

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

  const set = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const [a] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [b] = useState(() => 2 + Math.floor(Math.random() * 6));
  const [captcha, setCaptcha] = useState("");
  const captchaOk = Number(captcha) === a + b;

  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((current) => [...current, ...Array.from(list)].slice(0, MAX_FILES));
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const validateStep = () => {
    if (step === 0 && (!form.name.trim() || !form.phone.trim())) {
      toast.error("Please enter the worker's name and phone.");
      return false;
    }
    if (step === 1 && !form.employer.trim()) {
      toast.error("Please enter the employer name.");
      return false;
    }
    if (step === 2 && (!form.idate || !form.desc.trim())) {
      toast.error("Please add the injury date and description.");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const submit = async () => {
    if (!captchaOk) {
      toast.error("Please complete the security check.");
      return;
    }
    if (!agree) {
      toast.error("Please confirm the declaration to proceed.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(null);
    setEvidenceSummary(null);

    try {
      const input = buildClaimLodgementInput(form, files.length, agree);
      const result = await lodgeClaim(input);
      const isLive = result.source === "owc-api";
      setWasLiveSubmission(isLive);

      let summary: EvidenceUploadSummary | null = null;

      if (isLive && files.length > 0) {
        if (result.evidenceUploadToken) {
          setUploadProgress({ completed: 0, total: files.length });
          summary = await uploadSelectedEvidence({
            claimReference: result.reference,
            uploadToken: result.evidenceUploadToken,
            files,
            uploadOne: uploadClaimEvidence,
            onProgress: (completed, total) => setUploadProgress({ completed, total }),
          });
        } else {
          summary = {
            total: files.length,
            uploaded: 0,
            failed: files.length,
            failures: files.map((file) => ({
              fileName: file.name,
              error: "Secure upload authorization was not returned",
            })),
          };
        }
      }

      setEvidenceSummary(summary);
      setReference(result.reference);

      if (!isLive) {
        toast.success("Demonstration claim created. Configure the OWC API for live lodgement.");
      } else if (summary?.failed) {
        toast.warning(
          `Claim lodged. ${summary.uploaded} of ${summary.total} attachment${summary.total === 1 ? "" : "s"} uploaded.`,
        );
      } else {
        toast.success(
          files.length > 0
            ? "Claim and evidence submitted securely."
            : "Claim submitted securely.",
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Claim lodgement is temporarily unavailable. Please try again.",
      );
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  if (reference) {
    const hasFailures = Boolean(evidenceSummary?.failed);
    const allUploaded = Boolean(evidenceSummary && evidenceSummary.uploaded === evidenceSummary.total);

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
            Your claim is registered with the Office of Workers Compensation. Keep your reference number safe to track progress.
          </p>

          <div className="mt-6 flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Reference number</div>
              <div className="font-mono text-lg font-bold text-primary">{reference}</div>
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

          {wasLiveSubmission && allUploaded && evidenceSummary && (
            <div className="mt-4 w-full rounded-2xl border border-success/30 bg-success/10 p-4 text-left">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Evidence uploaded
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {evidenceSummary.uploaded} attachment{evidenceSummary.uploaded === 1 ? "" : "s"} securely transferred and queued for OWC review.
              </p>
            </div>
          )}

          {wasLiveSubmission && hasFailures && evidenceSummary && (
            <div className="mt-4 w-full rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
              <div className="text-sm font-semibold text-foreground">Claim lodged; some attachments need attention</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {evidenceSummary.uploaded} of {evidenceSummary.total} attachment{evidenceSummary.total === 1 ? "" : "s"} uploaded. Your claim remains valid. Failed evidence can be supplied again from the claim record.
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                {evidenceSummary.failures.slice(0, 4).map((failure) => (
                  <li key={failure.fileName}>• {failure.fileName}: {failure.error}</li>
                ))}
              </ul>
            </div>
          )}

          {!wasLiveSubmission && files.length > 0 && (
            <div className="mt-4 w-full rounded-2xl border border-border bg-secondary/50 p-4 text-left">
              <div className="text-sm font-semibold text-foreground">Demonstration mode</div>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                The claim reference is simulated and selected evidence was not transmitted. Live evidence upload starts automatically when the OWC API is configured.
              </p>
            </div>
          )}

          <Button onClick={() => navigate("track", { ref: reference })} className="mt-6 h-12 w-full">
            Track this claim <ArrowRight />
          </Button>
          <Button variant="outline" onClick={() => switchTab("home")} className="mt-3 h-12 w-full">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Lodge a Claim" subtitle={`Step ${step + 1} of ${STEPS.length} · ${STEPS[step].label}`} showBack={false} />

      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex items-center justify-between">
          {STEPS.map((item, index) => {
            const StepIcon = item.icon;
            const active = index === step;
            const done = index < step;
            return (
              <div key={item.label} className="flex flex-1 flex-col items-center">
                <span
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full border-2 transition",
                    done && "border-success bg-success text-white",
                    active && "border-gold bg-gold/15 text-gold-foreground",
                    !done && !active && "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  {done ? <CheckCircle2 className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                </span>
                <span className={cn("mt-1 text-[10px] font-semibold", active ? "text-primary" : "text-muted-foreground")}>{item.label}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gold-grad transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        <div key={step} className="animate-screen-in space-y-4">
          {step === 0 && (
            <>
              <Field id="name" label="Full name" required>
                <Input id="name" value={form.name} onChange={(event) => set("name", event.target.value)} placeholder="Given and family name" className="h-11" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="dob" label="Date of birth">
                  <Input id="dob" type="date" value={form.dob} onChange={(event) => set("dob", event.target.value)} className="h-11" />
                </Field>
                <Field id="nid" label="National ID">
                  <Input id="nid" value={form.nid} onChange={(event) => set("nid", event.target.value)} placeholder="ID number" className="h-11" />
                </Field>
              </div>
              <Field id="phone" label="Phone" required>
                <Input id="phone" value={form.phone} onChange={(event) => set("phone", event.target.value)} placeholder="+675 …" inputMode="tel" className="h-11" />
              </Field>
              <Field id="email" label="Email">
                <Input id="email" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} placeholder="you@example.com" className="h-11" />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field id="employer" label="Employer name" required>
                <Input id="employer" value={form.employer} onChange={(event) => set("employer", event.target.value)} placeholder="Company / organisation" className="h-11" />
              </Field>
              <Field id="occupation" label="Occupation">
                <Input id="occupation" value={form.occupation} onChange={(event) => set("occupation", event.target.value)} placeholder="Your role" className="h-11" />
              </Field>
              <Field label="Province">
                <Select value={form.province} onValueChange={(value) => set("province", value)}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select province" /></SelectTrigger>
                  <SelectContent>{PROVINCES.map((province) => <SelectItem key={province} value={province}>{province}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field id="wage" label="Weekly wage (Kina)" hint="Used to estimate entitlements.">
                <Input id="wage" value={form.wage} onChange={(event) => set("wage", event.target.value)} placeholder="e.g. 650" inputMode="numeric" className="h-11" />
              </Field>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field id="idate" label="Date of injury" required>
                  <Input id="idate" type="date" value={form.idate} onChange={(event) => set("idate", event.target.value)} className="h-11" />
                </Field>
                <Field label="Type of injury">
                  <Select value={form.itype} onValueChange={(value) => set("itype", value)}>
                    <SelectTrigger className="h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{CLAIM_TYPES.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent>
                  </Select>
                </Field>
              </div>
              <Field id="location" label="Where did it happen?">
                <Input id="location" value={form.location} onChange={(event) => set("location", event.target.value)} placeholder="Worksite / location" className="h-11" />
              </Field>
              <Field id="desc" label="Describe what happened" required>
                <Textarea id="desc" rows={5} value={form.desc} onChange={(event) => set("desc", event.target.value)} placeholder="Briefly describe the accident, how it occurred and the injury sustained." />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => camRef.current?.click()} className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-3 py-5 text-center transition active:scale-95 hover:border-gold">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><Camera className="h-5 w-5" /></span>
                  <span className="text-[12px] font-semibold text-foreground">Take photo</span>
                </button>
                <button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-3 py-5 text-center transition active:scale-95 hover:border-gold">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><Upload className="h-5 w-5" /></span>
                  <span className="text-[12px] font-semibold text-foreground">Select files</span>
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Select a medical report (MED-1), proof of ID, payslip and injury photos · PDF/JPG/PNG · up to {MAX_FILES} files · maximum 20 MB each.
              </p>

              <input ref={camRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={(event) => addFiles(event.target.files)} />
              <input ref={fileRef} type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(event) => addFiles(event.target.files)} />

              {files.length > 0 && (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                      <FileIcon className="h-4 w-4 shrink-0 text-gold" />
                      <span className="flex-1 truncate text-[13px] text-foreground">{file.name}</span>
                      <span className="text-[11px] text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</span>
                      <button type="button" onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${file.name}`}>
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <SecurityNote>
                Evidence is uploaded only after OWC issues the claim reference. Files use a short-lived claim-specific authorization and are sent through the secure OWC evidence service for validation and security scanning.
              </SecurityNote>

              {submitting && uploadProgress && (
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-foreground">Uploading evidence</span>
                    <span className="text-muted-foreground">{uploadProgress.completed} / {uploadProgress.total}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-gold-grad transition-all" style={{ width: `${uploadProgress.total ? (uploadProgress.completed / uploadProgress.total) * 100 : 0}%` }} />
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-secondary/40 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-foreground">Security check</span>
                  <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-lg bg-primary px-3 py-2 font-mono text-[15px] font-bold tracking-widest text-white">{a} + {b} = ?</span>
                  <Input value={captcha} onChange={(event) => setCaptcha(event.target.value)} inputMode="numeric" placeholder="Answer" className="h-10 flex-1" />
                  {captchaOk && <CheckCircle2 className="h-5 w-5 text-success" />}
                </div>
              </div>

              <label className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
                <Checkbox checked={agree} onCheckedChange={(value) => setAgree(Boolean(value))} className="mt-0.5" />
                <span className="text-[12px] leading-relaxed text-muted-foreground">
                  I declare that the information provided is true and correct to the best of my knowledge, and I consent to OWC processing this claim under the Workers Compensation Act 1978.
                </span>
              </label>
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-card p-3 pb-safe">
        <div className="flex gap-3 pb-1">
          <Button variant="outline" onClick={step === 0 ? back : () => setStep((current) => Math.max(current - 1, 0))} disabled={submitting} className="h-12 flex-1">
            {step === 0 ? "Cancel" : <><ArrowLeft /> Back</>}
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="h-12 flex-[2]">Continue <ArrowRight /></Button>
          ) : (
            <Button onClick={() => void submit()} disabled={submitting} className="h-12 flex-[2]">
              {submitting ? (
                <><Loader2 className="animate-spin" /> {uploadProgress ? `Uploading ${uploadProgress.completed}/${uploadProgress.total}` : "Submitting…"}</>
              ) : (
                <><Lock /> Submit securely</>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
