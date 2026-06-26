"use client";

import { Home, Radar, Plus, Newspaper, UserRound } from "lucide-react";
import { useNav, type ScreenKey } from "@/lib/nav";
import { cn } from "@/lib/utils";

const TABS: { key: ScreenKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "track", label: "Track", icon: Radar },
  { key: "news", label: "News", icon: Newspaper },
  { key: "account", label: "Account", icon: UserRound },
];

export function BottomNav() {
  const { activeTab, switchTab, navigate, screen } = useNav();

  return (
    <nav className="relative shrink-0 border-t border-border bg-card/95 px-2 pb-safe shadow-tab appbar-blur">
      {/* Center elevated Lodge action */}
      <button
        type="button"
        onClick={() => navigate("lodge")}
        aria-label="Lodge a claim"
        className={cn(
          "absolute left-1/2 top-0 z-10 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl text-navy shadow-app transition active:scale-95",
          "bg-gold-grad ring-4 ring-card"
        )}
      >
        <Plus className="h-7 w-7" strokeWidth={2.6} />
      </button>

      <div className="grid grid-cols-5 items-end pt-2">
        {TABS.slice(0, 2).map((t) => (
          <TabButton
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={activeTab === t.key && screen === t.key}
            onClick={() => switchTab(t.key)}
          />
        ))}
        <div className="flex flex-col items-center justify-end pb-1.5">
          <span className="mt-7 text-[10px] font-semibold text-gold">Lodge</span>
        </div>
        {TABS.slice(2).map((t) => (
          <TabButton
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={activeTab === t.key && screen === t.key}
            onClick={() => switchTab(t.key)}
          />
        ))}
      </div>
    </nav>
  );
}

function TabButton({
  label,
  icon: IconCmp,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Home;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 rounded-xl py-1.5 transition",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      <IconCmp
        className={cn("h-5 w-5 transition", active && "scale-110")}
        strokeWidth={active ? 2.5 : 2}
      />
      <span className={cn("text-[10px] font-medium", active && "font-bold")}>
        {label}
      </span>
    </button>
  );
}
