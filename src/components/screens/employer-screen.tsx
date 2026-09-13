"use client";

import { useState } from "react";
import {
  Siren,
  ArrowRight,
  CheckCircle2,
  Download,
  Headset,
  Loader2,
  Building2,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TopBar } from "@/components/app/top-bar";
import { Field, SectionTitle } from "@/components/app/kit";
import { Icon } from "@/components/app/icon";
import { useNav } from "@/lib/nav";
import type { EmployerVerifyResponse } from "@/lib/api/contracts";
import { EMPLOYER_STEPS, EMPLOYER_OBLIGATIONS } from "@/lib/owc-data";

export function EmployerScreen() {
  const { navigate } = useNav();
  const [verifyQuery, setVerifyQuery] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<EmployerVerifyResponse | null>(null);
  const [showInjuryForm, setShowInjuryForm] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [injuryReference, setInjuryReference] = useState<string | null>(null);
  const [injury, setInjury] = useState({
    employerName: "",
    employerContact: "",
    workerName: "",
    injuryDate: "",
    injuryType: "",
    description: "",
  });

  const verifyEmployer = async () => {
    const query = verifyQuery.trim();
    if (query.length < 2) {
      toast.error("Enter an employer name or registration number.");
      return;
    }
    setVerifying(true);
    setVerification(null);
    try {
      const response = await fetch("/api/owc/employers/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const payload = (await response.json().catch(() => ({}))) as EmployerVerifyResponse & { error?: string };
      if (!response.ok) throw new Error(payload.error || "Unable to verify the employer.");
      setVerification(payload);
      if (payload.registered) toast.success("Employer record verified.");
      else toast.info("No active employer registration was returned.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to verify the employer.");
    } finally {
      setVerifying(false);
    }
  };

  const submitInjury = async () => {
    if (!injury.employerName || !injury.workerName || !injury.injuryDate || injury.description.trim().length < 5) {
      toast.error("Complete the employer, worker, injury date and description.");
      return;
    }
    setReporting(true);
    try {
      const response = await fetch("/api/owc/injuries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(injury),
      });
      const payload = (await response.json().catch(() => ({}))) as { reference?: string; error?: string };
      if (!response.ok || !payload.reference) {
        throw new Error(payload.error || "The injury report could not be submitted.");
      }
      setInjuryReference(payload.reference);
      toast.success("Workplace injury report submitted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The injury report could not be submitted.");
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Employer Services" subtitle="Register · report · comply" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-app">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-white">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-[15px] font-bold text-primary">Verify employer registration</h2>
              <p className="text-[11px] text-muted-foreground">Check an employer against the OWC registration service.</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={verifyQuery}
                onChange={(event) => setVerifyQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && void verifyEmployer()}
                placeholder="Employer name or registration no."
                className="h-11 pl-9"
              />
            </div>
            <Button onClick={() => void verifyEmployer()} disabled={verifying} className="h-11">
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </Button>
          </div>
          {verification && (
            <div className="mt-3 rounded-xl bg-secondary/60 p-3 text-[12px]">
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <CheckCircle2 className={verification.registered ? "h-4 w-4 text-success" : "h-4 w-4 text-muted-foreground"} />
                {verification.registered ? "Registered employer" : "Registration not confirmed"}
              </div>
              {verification.employerName && <p className="mt-1 text-muted-foreground">{verification.employerName}</p>}
              {verification.registrationNumber && <p className="font-mono text-[11px] text-muted-foreground">{verification.registrationNumber}</p>}
              {verification.status && <p className="mt-1 text-[11px] font-medium text-primary">Status: {verification.status}</p>}
            </div>
          )}
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-destructive/30 bg-destructive/5">
          <button
            type="button"
            onClick={() => setShowInjuryForm((value) => !value)}
            className="flex w-full items-center gap-3 p-4 text-left transition active:scale-[0.99]"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-destructive text-white">
              <Siren className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-serif text-[15px] font-bold text-destructive">Report a workplace injury</span>
              <span className="block text-[12px] text-muted-foreground">Employers must notify OWC within 7 days.</span>
            </span>
            <ArrowRight className="h-5 w-5 shrink-0 text-destructive" />
          </button>

          {showInjuryForm && (
            <div className="space-y-3 border-t border-destructive/20 bg-card p-4">
              {injuryReference ? (
                <div className="rounded-xl bg-success/10 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-7 w-7 text-success" />
                  <p className="mt-2 text-[13px] font-semibold text-foreground">Injury report registered</p>
                  <p className="mt-1 font-mono text-[14px] font-bold text-primary">{injuryReference}</p>
                </div>
              ) : (
                <>
                  <Field id="injury-employer" label="Employer name" required>
                    <Input id="injury-employer" value={injury.employerName} onChange={(event) => setInjury((current) => ({ ...current, employerName: event.target.value }))} className="h-10" />
                  </Field>
                  <Field id="injury-worker" label="Worker name" required>
                    <Input id="injury-worker" value={injury.workerName} onChange={(event) => setInjury((current) => ({ ...current, workerName: event.target.value }))} className="h-10" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field id="injury-date" label="Injury date" required>
                      <Input id="injury-date" type="date" value={injury.injuryDate} onChange={(event) => setInjury((current) => ({ ...current, injuryDate: event.target.value }))} className="h-10" />
                    </Field>
                    <Field id="injury-type" label="Injury type">
                      <Input id="injury-type" value={injury.injuryType} onChange={(event) => setInjury((current) => ({ ...current, injuryType: event.target.value }))} className="h-10" />
                    </Field>
                  </div>
                  <Field id="injury-contact" label="Employer contact">
                    <Input id="injury-contact" value={injury.employerContact} onChange={(event) => setInjury((current) => ({ ...current, employerContact: event.target.value }))} className="h-10" />
                  </Field>
                  <Field id="injury-description" label="What happened?" required>
                    <Textarea id="injury-description" rows={4} value={injury.description} onChange={(event) => setInjury((current) => ({ ...current, description: event.target.value }))} />
                  </Field>
                  <Button onClick={() => void submitInjury()} disabled={reporting} className="h-11 w-full">
                    {reporting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit injury report"}
                  </Button>
                </>
              )}
            </div>
          )}
        </section>

        <section className="pt-6">
          <SectionTitle eyebrow="Getting started" title="How employer registration works" />
          <div className="mt-4 space-y-3">
            {EMPLOYER_STEPS.map((step, index) => (
              <div key={step.title} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-app">
                <div className="relative">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
                    <Icon name={step.icon} className="h-5 w-5" />
                  </span>
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-navy">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground">{step.title}</h3>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-6">
          <SectionTitle eyebrow="Compliance" title="Your obligations under the Act" />
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-app">
            <ul className="space-y-2.5">
              {EMPLOYER_OBLIGATIONS.map((obligation) => (
                <li key={obligation} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-[12.5px] leading-relaxed text-muted-foreground">{obligation}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pt-6">
          <SectionTitle eyebrow="Compensation process" title="Common employer questions" />
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="q1" className="rounded-2xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-[13px] font-semibold">When must I report an injury?</AccordionTrigger>
              <AccordionContent className="text-[12.5px] text-muted-foreground">Within 7 days of becoming aware of a workplace injury or illness, using the Employer&apos;s Report of Injury (EMP-2).</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="mt-2 rounded-2xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-[13px] font-semibold">What records must I keep?</AccordionTrigger>
              <AccordionContent className="text-[12.5px] text-muted-foreground">Accurate wage and hour records for all workers, plus a current workers compensation insurance policy.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="mt-2 rounded-2xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-[13px] font-semibold">How is compensation determined?</AccordionTrigger>
              <AccordionContent className="text-[12.5px] text-muted-foreground">OWC assesses medical evidence and wage records against the statutory schedule of rates to determine entitlements.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="space-y-3 py-6">
          <Button onClick={() => navigate("forms")} variant="outline" className="h-12 w-full justify-between">
            <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Employer forms (EMP-1, EMP-2, EMP-3)</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button onClick={() => navigate("contact", { category: "Employer Registration" })} className="h-12 w-full justify-between">
            <span className="flex items-center gap-2"><Headset className="h-4 w-4" /> Submit an employer enquiry</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>
    </div>
  );
}
