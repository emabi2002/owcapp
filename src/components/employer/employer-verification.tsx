"use client";

import { useState } from "react";
import { Building2, CheckCircle2, Loader2, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyEmployer, type EmployerVerifyResult } from "@/lib/api";

export function EmployerVerification() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmployerVerifyResult | null>(null);

  const verify = async () => {
    if (query.trim().length < 2) {
      toast.error("Enter an employer name or registration number.");
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      setResult(await verifyEmployer({ query }));
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Employer verification is temporarily unavailable.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-app">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-primary" />
        <h3 className="text-[13px] font-bold text-primary">Verify employer registration</h3>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Check an employer name or registration number against the OWC employer service.
      </p>
      <div className="mt-3 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && void verify()}
            placeholder="Employer name or registration no."
            className="h-11 pl-9"
          />
        </div>
        <Button onClick={() => void verify()} disabled={loading} className="h-11">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
        </Button>
      </div>

      {result && (
        <div className="mt-3 rounded-xl border bg-secondary/40 p-3">
          <div className="flex items-start gap-2">
            {result.registered ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            ) : (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[13px] font-semibold">
                  {result.registered ? result.name ?? query : "Employer not verified"}
                </span>
                <Badge
                  variant={result.registered ? "default" : "destructive"}
                  className={result.registered ? "bg-success text-white hover:bg-success" : undefined}
                >
                  {result.registered ? result.status ?? "Registered" : "Not verified"}
                </Badge>
              </div>
              {result.registrationNo && (
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {result.registrationNo}
                </div>
              )}
              {result.source === "mock" && (
                <div className="mt-1 text-[10px] text-muted-foreground">
                  Demonstration result — configure the OWC API for authoritative verification.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
