"use client";

import React, { useEffect } from "react";
import { db } from "@/lib/db";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";

export function SyncProvider({ children }: { children: React.ReactNode }) {
  // We can monitor sync status here globally
  const pendingCount = useLiveQuery(() => db.submissionQueue.where('synced').equals(0).count());

  useEffect(() => {
    const handleOnline = () => {
        syncSubmissions();
    };

    window.addEventListener('online', handleOnline);
    
    // Initial check if online
    if (navigator.onLine) {
        syncSubmissions();
    }

    return () => {
        window.removeEventListener('online', handleOnline);
    };
  }, []);

  const syncSubmissions = async () => {
      const pending = await db.submissionQueue.where('synced').equals(0).toArray();
      if (pending.length > 0) {
          const toastId = toast.loading(`Syncing ${pending.length} pending submissions...`);
          
          try {
              for (const submission of pending) {
                  const res = await fetch('/api/officer/declarations', {
                      method: 'POST',
                      headers: {'Content-Type': 'application/json'},
                      body: JSON.stringify(submission.data)
                  });
                  if (!res.ok) throw new Error("Sync failed for one or more items");
              }
              
              // Only delete if successful
              await db.submissionQueue.bulkDelete(pending.map(p => p.id!));
              
              toast.success("Sync complete", { id: toastId });
          } catch (error) {
              toast.error("Network sync failed. Will retry when connection stabilizes.", { id: toastId });
          }
      }
  };

  return (
    <>
      {children}
    </>
  );
}
