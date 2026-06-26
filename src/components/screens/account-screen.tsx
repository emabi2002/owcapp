"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Radar,
  FileDown,
  MessageSquareText,
  Bell,
  ShieldCheck,
  Fingerprint,
  FileLock2,
  ChevronRight,
  LogOut,
  UserCog,
  Phone,
  Mail,
  MapPin,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/app/top-bar";
import { useNav, type ScreenKey } from "@/lib/nav";
import { usePWA } from "@/lib/pwa";
import { PROFILE } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

export function AccountScreen() {
  const { navigate, signOut, unreadCount } = useNav();
  const { canInstall, isIOS, isStandalone, promptInstall } = usePWA();
  const [push, setPush] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const handleInstall = async () => {
    if (canInstall) {
      const res = await promptInstall();
      if (res === "accepted") toast.success("Installing OWC PNG…");
      return;
    }
    if (isIOS) {
      toast.info("Tap the Share icon, then ‘Add to Home Screen’.");
      return;
    }
    toast.info("Open your browser menu and choose ‘Install app’.");
  };

  const initials = PROFILE.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex h-full flex-col overflow-y-auto no-scrollbar bg-background">
      <TopBar title="My Account" subtitle="Profile & history" showBack={false} />

      {/* Profile header */}
      <div className="relative shrink-0 overflow-hidden bg-navy-grad px-5 pb-6 pt-5 text-white">
        <div className="absolute inset-0 bg-grid-faint opacity-50" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-grad font-serif text-2xl font-bold text-navy">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="truncate font-serif text-xl font-bold">{PROFILE.name}</h2>
              {PROFILE.verified && (
                <BadgeCheck className="h-5 w-5 shrink-0 text-gold" />
              )}
            </div>
            <p className="text-[12px] text-white/65">Member since {PROFILE.memberSince}</p>
          </div>
        </div>
        <div className="relative mt-4 space-y-1.5 text-[12px] text-white/75">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gold" /> {PROFILE.phone}
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-gold" /> {PROFILE.email}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 text-gold" /> {PROFILE.province}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2.5 px-4 pt-4">
        {[
          { label: "Claims", value: "2" },
          { label: "Saved forms", value: "3" },
          { label: "Enquiries", value: "1" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-3 text-center shadow-app">
            <div className="font-serif text-xl font-bold text-primary">{s.value}</div>
            <div className="text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity menu */}
      <Group title="Activity">
        <Row icon={<Radar className="h-5 w-5" />} label="My claims" sub="Track lodged claims" onClick={() => navigate("track" as ScreenKey)} />
        <Row icon={<FileDown className="h-5 w-5" />} label="Saved forms" sub="Offline documents" onClick={() => navigate("forms" as ScreenKey)} />
        <Row icon={<MessageSquareText className="h-5 w-5" />} label="My enquiries" sub="Messages to OWC" onClick={() => navigate("contact" as ScreenKey)} />
        <Row
          icon={<Bell className="h-5 w-5" />}
          label="Notifications"
          sub={unreadCount > 0 ? `${unreadCount} unread` : "All read"}
          onClick={() => navigate("notifications" as ScreenKey)}
          badge={unreadCount}
        />
      </Group>

      {/* Settings */}
      <Group title="Settings & security">
        {!isStandalone && (
          <Row
            icon={<Smartphone className="h-5 w-5" />}
            label="Install app"
            sub={isIOS ? "Add to Home Screen" : "Add OWC PNG to your phone"}
            onClick={handleInstall}
          />
        )}
        <ToggleRow
          icon={<Bell className="h-5 w-5" />}
          label="Push notifications"
          sub="Claim updates & notices"
          checked={push}
          onChange={(v) => {
            setPush(v);
            toast.success(v ? "Notifications on" : "Notifications off");
          }}
        />
        <ToggleRow
          icon={<Fingerprint className="h-5 w-5" />}
          label="Biometric unlock"
          sub="Face / fingerprint login"
          checked={biometric}
          onChange={(v) => {
            setBiometric(v);
            toast.success(v ? "Biometric unlock enabled" : "Biometric unlock disabled");
          }}
        />
        <Row icon={<FileLock2 className="h-5 w-5" />} label="Privacy notice" sub="How we protect your data" onClick={() => toast.info("OWC handles data under PNG Government data security standards.")} />
        <Row icon={<ShieldCheck className="h-5 w-5" />} label="Security & audit" sub="Login activity log" onClick={() => toast.info("All account activity is securely audit-logged.")} />
      </Group>

      {/* Staff console */}
      <Group title="OWC staff">
        <Row
          icon={<UserCog className="h-5 w-5" />}
          label="Staff quick review"
          sub="Authorised officers only"
          onClick={() => navigate("staff" as ScreenKey)}
        />
      </Group>

      {/* Sign out */}
      <div className="px-4 py-5">
        <Button
          variant="outline"
          onClick={signOut}
          className="h-12 w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <LogOut /> Sign out
        </Button>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          OWC PNG · v1.0.0 · Office of Workers Compensation
        </p>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-4 pt-5">
      <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </h3>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-app">
        {children}
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  sub,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-secondary/50"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-foreground">{label}</span>
        {sub && <span className="block text-[11.5px] text-muted-foreground">{sub}</span>}
      </span>
      {badge ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-navy">
          {badge}
        </span>
      ) : null}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function ToggleRow({
  icon,
  label,
  sub,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center gap-3 px-4 py-3.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-foreground">{label}</span>
        {sub && <span className="block text-[11.5px] text-muted-foreground">{sub}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
