"use client";

import {
  FileWarning,
  Radar,
  CalendarClock,
  Megaphone,
  BadgeInfo,
  CheckCheck,
  BellOff,
} from "lucide-react";
import { TopBar } from "@/components/app/top-bar";
import { useNav } from "@/lib/nav";
import type { Notification } from "@/lib/owc-data";
import { cn } from "@/lib/utils";

const META: Record<
  Notification["type"],
  { icon: typeof Radar; tone: string }
> = {
  document: { icon: FileWarning, tone: "bg-warning/15 text-[hsl(var(--warning))]" },
  claim: { icon: Radar, tone: "bg-primary/10 text-primary" },
  appointment: { icon: CalendarClock, tone: "bg-success/12 text-success" },
  notice: { icon: Megaphone, tone: "bg-gold/15 text-gold-foreground" },
  system: { icon: BadgeInfo, tone: "bg-secondary text-muted-foreground" },
};

export function NotificationsScreen() {
  const { notifications, markAllRead, toggleRead, unreadCount } = useNav();

  return (
    <div className="flex h-full flex-col">
      <TopBar
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
        action={
          <button
            type="button"
            onClick={markAllRead}
            className="grid h-9 w-9 place-items-center rounded-full text-white/90 transition active:scale-90 hover:bg-white/10"
            aria-label="Mark all read"
          >
            <CheckCheck className="h-5 w-5" />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4">
        {notifications.length === 0 ? (
          <div className="mt-16 flex flex-col items-center text-center">
            <BellOff className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-[14px] font-semibold text-foreground">
              No notifications
            </p>
            <p className="text-[12px] text-muted-foreground">
              Updates about your claims and OWC notices appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {notifications.map((n) => {
              const m = META[n.type];
              const M = m.icon;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleRead(n.id)}
                  className={cn(
                    "flex w-full gap-3 rounded-2xl border p-3.5 text-left transition active:scale-[0.99]",
                    n.unread
                      ? "border-gold/40 bg-card shadow-app"
                      : "border-border bg-card/60"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      m.tone
                    )}
                  >
                    <M className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={cn(
                          "truncate text-[13.5px]",
                          n.unread ? "font-bold text-foreground" : "font-semibold text-muted-foreground"
                        )}
                      >
                        {n.title}
                      </h3>
                      <span className="shrink-0 text-[10.5px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">
                      {n.body}
                    </p>
                  </div>
                  {n.unread && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
