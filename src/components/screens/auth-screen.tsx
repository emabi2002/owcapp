"use client";

import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Lock,
  UserCog,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NationalEmblem } from "@/components/brand/emblem";
import { ORG } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

type Method = "phone" | "email";

export function AuthScreen({
  onAuthed,
}: {
  onAuthed: (role: "public" | "staff") => void;
}) {
  const [staffMode, setStaffMode] = useState(false);
  const [method, setMethod] = useState<Method>("phone");
  const [identifier, setIdentifier] = useState("");
  const [step, setStep] = useState<"id" | "otp">("id");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const sendCode = () => {
    if (!identifier.trim()) {
      toast.error(`Enter your ${method === "phone" ? "phone number" : "email"}.`);
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setStep("otp");
      setSeconds(30);
      toast.success("Verification code sent. (Demo: enter any 6 digits)");
      setTimeout(() => inputs.current[0]?.focus(), 100);
    }, 1000);
  };

  const onOtpChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    if (d && i < 5) inputs.current[i + 1]?.focus();
  };

  const onOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = () => {
    if (code.join("").length < 6) {
      toast.error("Enter the 6-digit verification code.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      onAuthed(staffMode ? "staff" : "public");
    }, 1100);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Brand band */}
      <div className="relative shrink-0 overflow-hidden bg-navy-grad px-6 pb-7 pt-5 text-white">
        <div className="absolute inset-0 bg-grid-faint opacity-50" />
        <div className="relative flex flex-col items-center text-center">
          <NationalEmblem className="h-16 w-16" />
          <h1 className="mt-3 font-serif text-xl font-bold">
            {staffMode ? "OWC Staff Sign-in" : "Welcome to OWC PNG"}
          </h1>
          <p className="mt-1 text-[12px] text-white/65">
            {staffMode
              ? "Authorised officers only · secured access"
              : "Sign in to lodge & track claims securely"}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar px-6 pb-8 pt-6">
        {step === "id" ? (
          <div className="animate-fade-up space-y-5">
            {!staffMode && (
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
                {(["phone", "email"] as Method[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-2 text-[13px] font-semibold capitalize transition",
                      method === m
                        ? "bg-card text-primary shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    {m === "phone" ? (
                      <Phone className="h-4 w-4" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {m}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold">
                {staffMode
                  ? "Officer ID or email"
                  : method === "phone"
                    ? "Mobile number"
                    : "Email address"}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {staffMode || method === "email" ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
                </span>
                <Input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    staffMode
                      ? "officer@owc.gov.pg"
                      : method === "phone"
                        ? "+675 7XXX XXXX"
                        : "you@example.com"
                  }
                  inputMode={method === "phone" && !staffMode ? "tel" : "email"}
                  className="h-12 pl-9"
                />
              </div>
            </div>

            <Button onClick={sendCode} disabled={sending} className="h-12 w-full text-[15px]">
              {sending ? (
                <>
                  <Loader2 className="animate-spin" /> Sending code…
                </>
              ) : (
                <>
                  Send verification code <ArrowRight />
                </>
              )}
            </Button>

            <p className="flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              We use one-time passcodes (OTP) instead of passwords. Your details
              are encrypted and never shared. By continuing you accept the OWC
              privacy notice.
            </p>
          </div>
        ) : (
          <div className="animate-fade-up space-y-5">
            <button
              type="button"
              onClick={() => setStep("id")}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground"
            >
              <ChevronLeft className="h-4 w-4" /> Change {method}
            </button>
            <div>
              <h2 className="font-serif text-lg font-bold text-primary">
                Enter verification code
              </h2>
              <p className="mt-1 text-[12px] text-muted-foreground">
                A 6-digit code was sent to{" "}
                <span className="font-semibold text-foreground">{identifier}</span>
              </p>
            </div>

            <div className="flex justify-between gap-2">
              {code.map((c, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputs.current[i] = el;
                  }}
                  value={c}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => onOtpKey(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-14 w-full rounded-xl border border-input bg-card py-3 text-center font-mono text-xl font-bold text-primary outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
                />
              ))}
            </div>

            <Button onClick={verify} disabled={verifying} className="h-12 w-full text-[15px]">
              {verifying ? (
                <>
                  <Loader2 className="animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck /> Verify & continue
                </>
              )}
            </Button>

            <div className="text-center text-[12px] text-muted-foreground">
              {seconds > 0 ? (
                <>Resend code in {seconds}s</>
              ) : (
                <button
                  type="button"
                  onClick={sendCode}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Resend code
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-3 pt-8">
          {!staffMode && (
            <button
              type="button"
              onClick={() => onAuthed("public")}
              className="w-full text-center text-[13px] font-semibold text-primary"
            >
              Continue as guest
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setStaffMode((s) => !s);
              setStep("id");
              setIdentifier("");
            }}
            className="flex w-full items-center justify-center gap-1.5 text-[12px] font-medium text-muted-foreground"
          >
            <UserCog className="h-3.5 w-3.5" />
            {staffMode ? "Back to public sign-in" : "OWC staff sign-in"}
          </button>
        </div>
      </div>
    </div>
  );
}
