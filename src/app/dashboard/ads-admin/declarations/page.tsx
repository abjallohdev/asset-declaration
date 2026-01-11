"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "../columns"; // Shared columns from parent
import { Declaration } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function DeclarationsPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/ads-admin/declarations');
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDeclarations(data);
      } catch (error) {
        console.error("Error fetching declarations:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
            <h1 className="text-3xl font-light tracking-tight">Declarations</h1>
            <p className="text-muted-foreground">Review and manage asset declarations.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button>Export CSV</Button>
        </div>
      </div>

      <div className="border rounded-lg bg-white/50 backdrop-blur-sm p-1">
        {loading ? (
             <div className="text-center py-12 text-muted-foreground">Loading declarations...</div>
        ) : (
             <DataTable columns={columns} data={declarations} searchKey="userId" />
        )}
      </div>
    </div>
  );
}
