"use client";

import { Siren, ArrowRight, CheckCircle2, Download, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TopBar } from "@/components/app/top-bar";
import { SectionTitle } from "@/components/app/kit";
import { Icon } from "@/components/app/icon";
import { useNav } from "@/lib/nav";
import { EMPLOYER_STEPS, EMPLOYER_OBLIGATIONS } from "@/lib/owc-data";

export function EmployerScreen() {
  const { navigate } = useNav();

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Employer Services" subtitle="Register · report · comply" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        {/* Report injury CTA */}
        <button
          type="button"
          onClick={() => navigate("contact", { category: "Workplace Injury Report" })}
          className="flex w-full items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left transition active:scale-[0.99]"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-destructive text-white">
            <Siren className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-[15px] font-bold text-destructive">
              Report a workplace injury
            </span>
            <span className="block text-[12px] text-muted-foreground">
              Employers must notify OWC within 7 days.
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-destructive" />
        </button>

        {/* Registration / process steps */}
        <section className="pt-6">
          <SectionTitle eyebrow="Getting started" title="How employer registration works" />
          <div className="mt-4 space-y-3">
            {EMPLOYER_STEPS.map((s, i) => (
              <div
                key={s.title}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-app"
              >
                <div className="relative">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
                    <Icon name={s.icon} className="h-5 w-5" />
                  </span>
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-navy">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-foreground">{s.title}</h3>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="pt-6">
          <SectionTitle eyebrow="Compliance" title="Your obligations under the Act" />
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-app">
            <ul className="space-y-2.5">
              {EMPLOYER_OBLIGATIONS.map((o) => (
                <li key={o} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                    {o}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Compensation process FAQ */}
        <section className="pt-6">
          <SectionTitle eyebrow="Compensation process" title="Common employer questions" />
          <Accordion type="single" collapsible className="mt-3">
            <AccordionItem value="q1" className="rounded-2xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-[13px] font-semibold">
                When must I report an injury?
              </AccordionTrigger>
              <AccordionContent className="text-[12.5px] text-muted-foreground">
                Within 7 days of becoming aware of a workplace injury or illness,
                using the Employer&apos;s Report of Injury (EMP-2).
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="mt-2 rounded-2xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-[13px] font-semibold">
                What records must I keep?
              </AccordionTrigger>
              <AccordionContent className="text-[12.5px] text-muted-foreground">
                Accurate wage and hour records for all workers, plus a current
                workers compensation insurance policy.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="mt-2 rounded-2xl border border-border bg-card px-4">
              <AccordionTrigger className="text-left text-[13px] font-semibold">
                How is compensation determined?
              </AccordionTrigger>
              <AccordionContent className="text-[12.5px] text-muted-foreground">
                OWC assesses medical evidence and wage records against the
                statutory schedule of rates to determine entitlements.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Actions */}
        <section className="space-y-3 py-6">
          <Button onClick={() => navigate("forms")} variant="outline" className="h-12 w-full justify-between">
            <span className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Employer forms (EMP-1, EMP-2, EMP-3)
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => navigate("contact", { category: "Employer Registration" })}
            className="h-12 w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Headset className="h-4 w-4" /> Submit an employer enquiry
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </section>
      </div>
    </div>
  );
}
