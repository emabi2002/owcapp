import { NavProvider } from "@/lib/nav";
import { PWAProvider } from "@/lib/pwa";
import { AppShell } from "@/components/app/app-shell";
import { Toaster } from "@/components/ui/sonner";

export default function Page() {
  return (
    <PWAProvider>
      <NavProvider>
        <AppShell />
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </NavProvider>
    </PWAProvider>
  );
}
