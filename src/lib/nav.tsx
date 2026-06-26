"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NOTIFICATIONS, type Notification } from "@/lib/owc-data";

export type ScreenKey =
  | "home"
  | "lodge"
  | "track"
  | "employer"
  | "forms"
  | "news"
  | "news-detail"
  | "contact"
  | "fraud"
  | "notifications"
  | "account"
  | "staff"
  | "faqs";

export const TAB_ROOTS: ScreenKey[] = ["home", "track", "news", "account"];

type Stage = "splash" | "auth" | "app";
type Role = "public" | "staff";

type NavEntry = { screen: ScreenKey; params?: Record<string, unknown> };

interface NavContextValue {
  stage: Stage;
  role: Role;
  screen: ScreenKey;
  params: Record<string, unknown>;
  activeTab: ScreenKey;
  canGoBack: boolean;
  notifications: Notification[];
  unreadCount: number;
  enterApp: (role?: Role) => void;
  goToAuth: () => void;
  signOut: () => void;
  navigate: (screen: ScreenKey, params?: Record<string, unknown>) => void;
  switchTab: (tab: ScreenKey) => void;
  back: () => void;
  markAllRead: () => void;
  toggleRead: (id: string) => void;
}

const NavContext = createContext<NavContextValue | null>(null);

// DEV preview: set to a screen key to boot straight into the app for review.
// DEV preview: set to a screen key to boot straight into the app for review.
// Keep `null` for the production splash → login → app flow.
const DEV_START: {
  stage: Stage;
  screen: ScreenKey;
  role?: Role;
  params?: Record<string, unknown>;
} | null = null;

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>(DEV_START?.stage ?? "splash");
  const [role, setRole] = useState<Role>(DEV_START?.role ?? "public");
  const [stack, setStack] = useState<NavEntry[]>([
    { screen: DEV_START?.screen ?? "home", params: DEV_START?.params },
  ]);
  const [activeTab, setActiveTab] = useState<ScreenKey>("home");
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const current = stack[stack.length - 1];

  const enterApp = useCallback((r: Role = "public") => {
    setRole(r);
    setStack([{ screen: r === "staff" ? "staff" : "home" }]);
    setActiveTab("home");
    setStage("app");
  }, []);

  const goToAuth = useCallback(() => {
    setStage("auth");
  }, []);

  const signOut = useCallback(() => {
    setStack([{ screen: "home" }]);
    setActiveTab("home");
    setRole("public");
    setStage("auth");
  }, []);

  const navigate = useCallback(
    (screen: ScreenKey, params?: Record<string, unknown>) => {
      setStack((s) => [...s, { screen, params }]);
      if (TAB_ROOTS.includes(screen)) setActiveTab(screen);
    },
    []
  );

  const switchTab = useCallback((tab: ScreenKey) => {
    setStack([{ screen: tab }]);
    setActiveTab(tab);
  }, []);

  const back = useCallback(() => {
    setStack((s) => {
      if (s.length <= 1) return s;
      const next = s.slice(0, -1);
      const top = next[next.length - 1].screen;
      if (TAB_ROOTS.includes(top)) setActiveTab(top);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((n) => n.map((x) => ({ ...x, unread: false })));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((n) =>
      n.map((x) => (x.id === id ? { ...x, unread: !x.unread } : x))
    );
  }, []);

  const value = useMemo<NavContextValue>(
    () => ({
      stage,
      role,
      screen: current.screen,
      params: current.params ?? {},
      activeTab,
      canGoBack: stack.length > 1,
      notifications,
      unreadCount: notifications.filter((n) => n.unread).length,
      enterApp,
      goToAuth,
      signOut,
      navigate,
      switchTab,
      back,
      markAllRead,
      toggleRead,
    }),
    [
      stage,
      role,
      current,
      activeTab,
      stack.length,
      notifications,
      enterApp,
      goToAuth,
      signOut,
      navigate,
      switchTab,
      back,
      markAllRead,
      toggleRead,
    ]
  );

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used within NavProvider");
  return ctx;
}
