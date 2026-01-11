"use client";

import { useEffect, useState } from "react";

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    // Only run on client and in dev
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        const initMsw = async () => {
             const { worker } = await import("@/mocks/browser");
             await worker.start({
                 onUnhandledRequest: 'bypass', 
             });
             setMswReady(true);
        };
        initMsw();
    } else {
        setMswReady(true);
    }
  }, []);

  if (!mswReady) {
      return null; // or a loading spinner
  }

  return <>{children}</>;
}
