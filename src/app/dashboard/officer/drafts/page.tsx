"use client";

import { Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

export default function DraftsPage() {
  const router = useRouter();

  // Real drafts data from IndexedDB
  const drafts = useLiveQuery(() => db.drafts.toArray());

  if (!drafts) return <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />Loading drafts...</div>;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Draft Declarations</h1>
        <p className="text-muted-foreground">Continue working on your saved declarations.</p>
      </div>

      <div className="border rounded-lg bg-white/50 backdrop-blur-sm overflow-hidden">
        {drafts.length > 0 ? (
            <DataTable columns={columns} data={drafts} />
        ) : (
             <div className="p-12 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-3 opacity-20" />
                No saved drafts found.
            </div>
        )}
      </div>
    </div>
  );
}
