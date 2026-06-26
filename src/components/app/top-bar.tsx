"use client";

import { ChevronLeft } from "lucide-react";
import { useNav } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function TopBar({
  title,
  subtitle,
  action,
  showBack = true,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  showBack?: boolean;
}) {
  const { back, canGoBack } = useNav();
  return (
    <div className="sticky top-0 z-20 appbar-blur bg-navy-grad text-white">
      <div className="flex items-center gap-2 px-3 py-3">
        {showBack && canGoBack ? (
          <button
            type="button"
            onClick={back}
            aria-label="Go back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/90 transition active:scale-90 hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : (
          <span className="w-1.5" />
        )}
        <div className={cn("min-w-0 flex-1", !showBack && "pl-2")}>
          <h1 className="truncate font-serif text-lg font-bold leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-[11px] font-medium text-white/65">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
