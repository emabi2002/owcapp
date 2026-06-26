"use client";

import { Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function SectionTitle({
  eyebrow,
  title,
  className,
}: {
  eyebrow?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <h2 className="font-serif text-[19px] font-bold leading-tight text-primary">
        {title}
      </h2>
    </div>
  );
}

export function Field({
  id,
  label,
  required,
  hint,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-[13px] font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function InfoRow({
  icon,
  label,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-3 text-left",
        onClick && "transition active:scale-[0.99] hover:border-gold/60"
      )}
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-[14px] font-semibold text-foreground">
          {value}
        </span>
      </span>
    </Comp>
  );
}

export function SecurityNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Lock className="h-3.5 w-3.5 text-success" />
      {children}
    </p>
  );
}

export function Pill({
  children,
  tone = "navy",
  className,
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "success" | "warning" | "muted" | "destructive";
  className?: string;
}) {
  const tones: Record<string, string> = {
    navy: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold-foreground",
    success: "bg-success/12 text-success",
    warning: "bg-warning/15 text-[hsl(var(--warning))]",
    muted: "bg-secondary text-muted-foreground",
    destructive: "bg-destructive/12 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
