"use client";

import { useEffect, useState } from "react";
import { SignalHigh, Wifi, BatteryMedium } from "lucide-react";

export function StatusBar({ dark = true }: { dark?: boolean }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      let h = d.getHours();
      const m = d.getMinutes().toString().padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      setTime(`${h}:${m} ${ampm}`);
    };
    fmt();
    const t = setInterval(fmt, 10000);
    return () => clearInterval(t);
  }, []);

  const tone = dark ? "text-white" : "text-primary";

  return (
    <div
      className={`flex items-center justify-between px-5 pt-2 pb-1 text-[12px] font-semibold ${tone}`}
    >
      <span className="tracking-tight tabular-nums">{time || "9:41 AM"}</span>
      <div className="flex items-center gap-1.5">
        <SignalHigh className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryMedium className="h-4 w-4" />
      </div>
    </div>
  );
}
