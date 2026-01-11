"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { SyncProvider } from "@/components/providers/SyncProvider";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SessionProvider>
          <SyncProvider>
              <OfflineIndicator />
              {children}
          </SyncProvider>
        </SessionProvider>
      </ThemeProvider>
    </Provider>
  );
}
