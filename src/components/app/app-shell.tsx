"use client";

import { useNav, type ScreenKey } from "@/lib/nav";
import { StatusBar } from "@/components/app/status-bar";
import { BottomNav } from "@/components/app/bottom-nav";
import { SplashScreen } from "@/components/screens/splash-screen";
import { AuthScreen } from "@/components/screens/auth-screen";
import { HomeScreen } from "@/components/screens/home-screen";
import { LodgeScreen } from "@/components/screens/lodge-screen";
import { TrackScreen } from "@/components/screens/track-screen";
import { EmployerScreen } from "@/components/screens/employer-screen";
import { FormsScreen } from "@/components/screens/forms-screen";
import { NewsScreen, NewsDetailScreen } from "@/components/screens/news-screen";
import { ContactScreen } from "@/components/screens/contact-screen";
import { FraudScreen } from "@/components/screens/fraud-screen";
import { NotificationsScreen } from "@/components/screens/notifications-screen";
import { AccountScreen } from "@/components/screens/account-screen";
import { StaffScreen } from "@/components/screens/staff-screen";

const SCREENS: Record<ScreenKey, React.ComponentType> = {
  home: HomeScreen,
  lodge: LodgeScreen,
  track: TrackScreen,
  employer: EmployerScreen,
  forms: FormsScreen,
  news: NewsScreen,
  "news-detail": NewsDetailScreen,
  contact: ContactScreen,
  fraud: FraudScreen,
  notifications: NotificationsScreen,
  account: AccountScreen,
  staff: StaffScreen,
  faqs: HomeScreen,
};

export function AppShell() {
  return (
    <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[hsl(213_45%_9%)] sm:p-6">
      {/* Ambient backdrop (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden sm:block">
        <div className="absolute inset-0 bg-navy-grad opacity-90" />
        <div className="absolute inset-0 bg-grid-faint opacity-40" />
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-[hsl(212_80%_40%)]/30 blur-3xl" />
      </div>

      {/* Phone frame */}
      <div className="relative z-10 flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background sm:h-[896px] sm:max-h-[92vh] sm:rounded-[2.75rem] sm:border-[10px] sm:border-[hsl(213_50%_6%)] sm:shadow-[0_40px_90px_-20px_rgba(0,0,0,0.6)]">
        <Frame />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <>
      {/* Status bar strip (always navy) */}
      <div className="relative z-30 shrink-0 bg-[hsl(var(--navy-deep))]">
        <StatusBar dark />
        {/* notch (desktop) */}
        <div className="pointer-events-none absolute left-1/2 top-0 hidden h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[hsl(213_50%_6%)] sm:block" />
      </div>

      {/* Stage content */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <Stage />
      </div>
    </>
  );
}

function Stage() {
  const { stage, screen, role, enterApp, goToAuth } = useNav();

  if (stage === "splash") {
    return <SplashScreen onDone={goToAuth} />;
  }

  if (stage === "auth") {
    return <AuthScreen onAuthed={(r) => enterApp(r)} />;
  }

  const ScreenComp = SCREENS[screen] ?? HomeScreen;

  return (
    <>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div key={screen} className="absolute inset-0 animate-screen-in">
          <ScreenComp />
        </div>
      </div>
      {role === "public" && screen !== "lodge" && <BottomNav />}
    </>
  );
}
