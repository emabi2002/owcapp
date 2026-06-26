"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Siren,
  Send,
  Loader2,
  CheckCircle2,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TopBar } from "@/components/app/top-bar";
import { Field, SectionTitle, SecurityNote } from "@/components/app/kit";
import { useNav } from "@/lib/nav";
import { ORG, ENQUIRY_CATEGORIES } from "@/lib/owc-data";

export function ContactScreen() {
  const { params } = useNav();
  const [category, setCategory] = useState((params.category as string) || "");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!category) return toast.error("Please choose an enquiry category.");
    if (!name || !contact) return toast.error("Please add your name and contact.");
    if (!message) return toast.error("Please write your enquiry.");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setDone(true);
      toast.success("Enquiry submitted. Reference ENQ-2026-" + Math.floor(1000 + Math.random() * 8999));
    }, 1200);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="Contact & Enquiry" subtitle="We're here to help" />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-5">
        {/* Quick contact tiles */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${ORG.phone.replace(/\s/g, "")}`}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-app transition active:scale-95"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
              <Phone className="h-5 w-5" />
            </span>
            <span className="text-[11px] text-muted-foreground">Call OWC</span>
            <span className="text-[13px] font-bold text-foreground">{ORG.phone}</span>
          </a>
          <a
            href={`mailto:${ORG.email}`}
            className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-app transition active:scale-95"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-grad text-navy">
              <Mail className="h-5 w-5" />
            </span>
            <span className="text-[11px] text-muted-foreground">Email</span>
            <span className="truncate text-[13px] font-bold text-foreground">
              {ORG.email}
            </span>
          </a>
        </div>

        {/* Emergency */}
        <a
          href={`tel:${ORG.emergency.replace(/\s/g, "")}`}
          className="mt-3 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 transition active:scale-[0.99]"
        >
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-destructive text-white">
            <Siren className="h-5 w-5" />
            <span className="absolute inset-0 rounded-full border border-destructive animate-ring-pulse" />
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-bold text-destructive">
              Emergency / urgent line
            </div>
            <div className="text-[12px] text-muted-foreground">
              Serious workplace incidents · {ORG.emergency}
            </div>
          </div>
        </a>

        {/* Map */}
        <section className="pt-6">
          <SectionTitle eyebrow="Visit us" title="Head office" />
          <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card shadow-app">
            <div className="relative h-36 bg-[hsl(212_40%_88%)] bg-grid-faint">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(115deg, hsl(152 30% 78%) 0%, hsl(197 35% 80%) 45%, hsl(212 40% 86%) 100%)",
                }}
              />
              {/* faux roads */}
              <div className="absolute left-0 top-1/2 h-1.5 w-full -translate-y-1/2 bg-white/70" />
              <div className="absolute left-1/3 top-0 h-full w-1.5 bg-white/70" />
              <div className="absolute right-1/4 top-0 h-full w-1 bg-white/50" />
              {/* pin */}
              <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-full">
                <span className="relative grid place-items-center">
                  <MapPin className="h-8 w-8 fill-destructive text-white drop-shadow" />
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div>
                  <div className="text-[13px] font-semibold text-foreground">
                    {ORG.address}
                  </div>
                  <div className="text-[12px] text-muted-foreground">{ORG.city}</div>
                  <div className="text-[12px] text-muted-foreground">{ORG.postal}</div>
                </div>
              </div>
              <div className="mt-2.5 flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <div className="text-[12px] text-muted-foreground">{ORG.hours}</div>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Waigani+Port+Moresby+Papua+New+Guinea"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-primary"
              >
                <Navigation className="h-3.5 w-3.5" /> Open in Maps
              </a>
            </div>
          </div>
        </section>

        {/* Enquiry form */}
        <section className="pt-6">
          <SectionTitle eyebrow="Send a message" title="Submit an enquiry" />
          {done ? (
            <div className="mt-3 flex flex-col items-center rounded-2xl border border-success/30 bg-success/5 p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
              <h3 className="mt-3 font-serif text-lg font-bold text-primary">
                Enquiry received
              </h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                Thank you. An OWC officer will respond to your enquiry within 2–3
                business days.
              </p>
              <Button
                variant="outline"
                className="mt-4 h-11"
                onClick={() => {
                  setDone(false);
                  setMessage("");
                }}
              >
                Send another
              </Button>
            </div>
          ) : (
            <div className="mt-3 space-y-4 rounded-2xl border border-border bg-card p-4 shadow-app">
              <Field label="Enquiry category" required>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENQUIRY_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="cname" label="Your name" required>
                <Input
                  id="cname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="h-11"
                />
              </Field>
              <Field id="ccontact" label="Phone or email" required>
                <Input
                  id="ccontact"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="How we should reply"
                  className="h-11"
                />
              </Field>
              <Field id="cmsg" label="Message" required>
                <Textarea
                  id="cmsg"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                />
              </Field>
              <Button onClick={submit} disabled={sending} className="h-12 w-full">
                {sending ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send /> Submit enquiry
                  </>
                )}
              </Button>
              <SecurityNote>
                Protected by spam filtering. Your details are kept confidential.
              </SecurityNote>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
