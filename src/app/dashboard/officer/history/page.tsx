"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Declaration } from "@/lib/mock-data";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

import { declarationService } from "@/services/declaration.service";

export default function HistoryPage() {
  const [myDeclarations, setMyDeclarations] = useState<Declaration[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock current user ID matching dashboard
  const currentUserId = "u2";

  useEffect(() => {
    declarationService.getMyDeclarations()
       .then((data) => {
           // Filter for current user (simulated) same as dashboard
           setMyDeclarations(data.filter(d => d.userId === currentUserId || d.userId === 'u3')); 
           setLoading(false);
       })
       .catch(err => setLoading(false));
 }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-light tracking-tight">Declaration History</h1>
        <p className="text-muted-foreground">View your past asset declarations and their status.</p>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>My Declarations</CardTitle>
           <CardDescription>Records of all submitted forms.</CardDescription>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Loading history...</div>
            ) : (
               <DataTable columns={columns} data={myDeclarations} />
            )}
        </CardContent>
      </Card>
    </div>
  );
}
